export default(url)=>{

	return new Promise((resolve)=>{

		const video = document.createElement('video');
		const canavas = document.createElement('canvas')

		video.autoplay = true;
		video.muted = true;
		video.src = url;

		video.onloadeddata = () => {

			const { videoWidth, videoHeight } = video

			let ctx = canavas.getContext('2d')

			canavas.width = videoWidth;
			canavas.height = videoHeight;

			ctx.drawImage(video, 0, 0, videoWidth, videoHeight)

			video.pause();

			return resolve(canavas.toDataURL("image/jpeg"))
		}

	})
		
}