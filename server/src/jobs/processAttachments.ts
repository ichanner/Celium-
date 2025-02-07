//@ts-nocheck
import IAttachment from "../interfaces/IAttachment";
import { Container } from "typedi";
import config from "../config/";

const BUCKET_NAME = config.ATTACHMENTS_BUCKET_NAME;
const MEDIA_CONVERT_ROLE = `arn:aws:iam::${config.AWS_ACCOUNT_ID}:role/service-role/MediaConvert_Default_Role`;
const MEDIA_CONVERT_QUEUE = `arn:aws:mediaconvert:${config.AWS_REGION}:${config.AWS_ACCOUNT_ID}:queues/Default`;

export default async (chat_id: string, message_id: string, attachments: IAttachment[]) => {
    
    const videos = attachments.filter(({ format }) => format.startsWith('video/')).map(({ filename }) => VideoInput(filename));
  
    let promises = [];

    if(videos.length > 0){

        const mediaConvert = Container.get('mediaConvert');

        promises.push(processVideos(chat_id, message_id, videos, VIDEO_QUALITIES, mediaConvert))
    }

    await Promise.all(promises);
};


const VideoInput = (filename: string) => {
    return {
        AudioSelectors: {

            "Audio Selector 1": {

                DefaultSelection: "DEFAULT"
            }
        },

        VideoSelector: {},

        TimecodeSource: "ZEROBASED",

        FileInput: `s3://${BUCKET_NAME}/temp/${filename}`
    };
};

const HlsOutput = (max_bitrate: number, width: number, height: number) => {
    return {
        ContainerSettings: {
            Container: "M3U8",
            M3u8Settings: {}
        },
        VideoDescription: {
            Width: width,
            Height: height,
            Sharpness: 50,
            CodecSettings: {
                Codec: "H_264",
                H264Settings: {
                    InterlaceMode: "PROGRESSIVE",
                    MaxBitrate: max_bitrate,
                    RateControlMode: "QVBR",
                    SceneChangeDetect: "TRANSITION_DETECTION"
                }
            }
        },
        AudioDescriptions: [
            {
                AudioSourceName: "Audio Selector 1",
                CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                        Bitrate: 96000,
                        CodingMode: "CODING_MODE_2_0",
                        SampleRate: 48000
                    }
                }
            }
        ],
        OutputSettings: {
            HlsSettings: {
                SegmentModifier: "_segment_"
            }
        },
        NameModifier: `_HLS_${width}x${height}`
    };
};

const VIDEO_QUALITIES = {
    '1:1': [
        { max_bitrate: 2500000, width: 1080, height: 1080 },
        { max_bitrate: 1500000, width: 720, height: 720 },
        { max_bitrate: 800000, width: 480, height: 480 }
    ],
    '9:16': [
        { max_bitrate: 2500000, width: 1080, height: 1920 },
        { max_bitrate: 1500000, width: 720, height: 1280 },
        { max_bitrate: 800000, width: 480, height: 854 }
    ],
    '16:9': [
        { max_bitrate: 2500000, width: 1920, height: 1080 },
        { max_bitrate: 1500000, width: 1280, height: 720 },
        { max_bitrate: 800000, width: 854, height: 480 }
    ]
};

const processVideos = async (chat_id: string, message_id: string, inputs: ReturnType<typeof VideoInput>[], videoQualities: typeof VIDEO_QUALITIES, mediaConvert) => {

    const output_path = `s3://${BUCKET_NAME}/processed/${chat_id}/${message_id}/`;

    const outputs = [].concat(
        videoQualities['1:1'].map(({ max_bitrate, width, height }) => HlsOutput(max_bitrate, width, height)),
        videoQualities['9:16'].map(({ max_bitrate, width, height }) => HlsOutput(max_bitrate, width, height)),
        videoQualities['16:9'].map(({ max_bitrate, width, height }) => HlsOutput(max_bitrate, width, height))
    );

    const jobSettings = {
        Role: MEDIA_CONVERT_ROLE,
        Queue: MEDIA_CONVERT_QUEUE,
        Settings: {
            TimecodeConfig: { Source: "ZEROBASED" },
            OutputGroups: [
                {
                    Name: "Apple HLS",
                    Outputs: outputs,
                    OutputGroupSettings: {
                        Type: "HLS_GROUP_SETTINGS",
                        HlsGroupSettings: {
                            SegmentLength: 10,
                            Destination: output_path,
                            MinSegmentLength: 0
                        }
                    }
                },
                {
                    CustomName: "Thumbnail",
                    Name: "File Group",
                    Outputs: [
                        {
                            ContainerSettings: { Container: "RAW" },
                            VideoDescription: {
                                CodecSettings: {
                                    Codec: "FRAME_CAPTURE",
                                    FrameCaptureSettings: {
                                        FramerateNumerator: 30,
                                        FramerateDenominator: 88,
                                        MaxCaptures: 1,
                                        Quality: 80
                                    }
                                }
                            },
                            Extension: "jpg"
                        }
                    ],
                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination: output_path
                        }
                    }
                },
                {
                    CustomName: "Original",
                    Name: "File Group",
                    Outputs: [
                        {
                            ContainerSettings: { Container: "MP4", Mp4Settings: {} },
                            VideoDescription: {
                                Width: 1920,
                                Height: 1080,
                                CodecSettings: {
                                    Codec: "H_264",
                                    H264Settings: {
                                        MaxBitrate: 5000000,
                                        RateControlMode: "QVBR",
                                        SceneChangeDetect: "TRANSITION_DETECTION"
                                    }
                                }
                            },
                            AudioDescriptions: [
                                {
                                    CodecSettings: {
                                        Codec: "AAC",
                                        AacSettings: {
                                            Bitrate: 96000,
                                            CodingMode: "CODING_MODE_2_0",
                                            SampleRate: 48000
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination: output_path
                        }
                    }
                }
            ],
            FollowSource: 1,
            Inputs: inputs
        },
        StatusUpdateInterval: 'SECONDS_20'
    };

    try {
        await mediaConvert.createJob(jobSettings).promise();
    } catch (error) {
        console.error('Error creating MediaConvert job:', error);
    }
};

const processImages = async (chat_id: string, message_id: string, inputs: ReturnType<typeof ImageInput>[], mediaConvert) => {
   
};
