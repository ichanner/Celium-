function calculatePostWidthConstant() {
  const screenWidth = window.innerWidth; // Get the current window/screen width
  let postWidthConstant;

  // Calculate the post width constant using the linear equation
  postWidthConstant = (-0.00056921 * screenWidth) + 1.1045156;

  return postWidthConstant;
}

export const POST_WIDTH_FACTOR = calculatePostWidthConstant()
export const HEIGHT = window.screen.height;
export const WIDTH = window.screen.width;


export const BOARD_GUTTER_SIZE = 5
export const SECTION_GUTTER_SIZE = 5

export const DIRECTIONS = {

	TOP: 0,
	DOWN: 1,
	AROUND: 2,
}

export const CREATION_STATES = {

	DEFAULT: 0,
	ASSETS: 1,
	BODY: 2
}

export const LOADING_STATES = {

	SECTION_LOADING: 0,
	BOTTOM_LOADING: 1,
	TOP_LOADING: 2
}

export const COLOR_SCHEME = {

	PRIMARY: '#242424',
	SECONDARY:'#0D47A1',
	POST_BODY: '#000000',
	POST_TEXT_PRIMARY: '#FFFFFF',
	POST_TEXT_SECONDARY: '#808080',
	WHITE: '#fff',
    BLACK: '#000',
    ALTO: '#dfdfdf',
    GREY: '#808080',
    EBONY_CLAY: '#292d3e',
    LIGHT_BLUE: '#4b68b3',
    HEATHER: '#bfc7d5',
    LYNCH: '#697098',
    SHARK: '#242526',
    SHUTTLE_GREY: '#565E67'
}