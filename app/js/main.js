"use strict";
// The handles are created because the functions can not be used before declared
const skipper_handle = () => {skipper()}
const portrait_handle = () => {check_portrait()}
let dev_mode = portrait_handle
// This mode is for skipping steps during development testing
// dev_mode = skipper_handle
$(dev_mode)

// Class Audio Controller
class Audio_controller {
	constructor() {
		this.last_audio = null
	}

	play_audio(audio_name) {
		$("." + audio_name)[0].play()
		this.last_audio = audio_name
	}

	pause_audio(remove_status = true) {
		if(this.last_audio !== null) {
			$("." + this.last_audio)[0].pause()
			if(remove_status === true) {
				$("." + this.last_audio).attr("data-src", $("." + this.last_audio).attr("src"))
				$("." + this.last_audio).attr("src", "")
			}
		}
	}
}
const audio_controller = new Audio_controller();

// Pending Tasks Class
class Pending_task {
	constructor() {
		this.task_array = []
	}

	add_task(new_task) {
		this.task_array.push(new_task)
	}

	execute_tasks() {
		for(let task in this.task_array) {
			this.task_array[task].call()
		}
	}
}
const pending_task = new Pending_task();

// Class Document Event for managing various events on document level
class Doc_event {
	constructor() {
		this.event_function = null
		this.event_skip = false
	}

	add_event(event_function) {
		this.event_function = event_function
		this.unsuspend_event()
	}

	skip_event() {
		this.event_skip = true
	}

	check_event_skip() {
		if(this.event_skip === true) {
			this.event_skip = false
			return true
		}
	}

	suspend_event() {
		$(document).off("click")
		$(document).off("keypress")
	}

	unsuspend_event() {
		$(document).on("click", this.event_function)
		$(document).on("keypress", this.event_function)
	}

	remove_event() {
		this.event_function = null
		this.suspend_event()
	}
}
const doc_event = new Doc_event();

// Checks for the portrait mode
const check_portrait = () => {
	// Remove the noscript block
	$("noscript").remove()

	// Remove IE block script and messages
	$("#detect_ie").remove()

	// Checks if the browser is in Portrait mode
	if(window.innerHeight > window.innerWidth) {
		// Get the modal
		const modal = document.getElementById('detect_portrait')
		modal.style.display = "block"

		// Get the <span> element that closes the modal
		const span = document.getElementsByClassName("close")[0]

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none"
			init()
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none"
				init()
			}
		}
	} else {
		init()
	}
}

// Initialize the page
const init = () => {
	// Remove the Portrait mode script
	$("#detect_portrait").remove()

	// Remove the loading screen once the page is ready
	$(".not_ready").remove()

	// Make the avatar appear
	avatar_module.avatar_intro()
}

// Show icon to click, press or touch
const click_press_touch_show = () => {
	$(".click_press_touch").css({"top": "37vw", "left": "72vw"}).show(200)
	doc_event.add_event(avatar_module.intro_close)
}

// Avatar block module
const avatar_module = (function() {
	// Make the avatar appear
	const avatar_intro = () => {
		audio_controller.play_audio("audio_avatar_intro")
		$(".avatar_container #avatar_img").animate({width: '21.8vw', height: '21.8vw'}, 500)
		$(".avatar_container #avatar_img").fadeTo(700, 1, avatar_intro_box_show)
	}

	// Show avatar intro box
	const avatar_intro_box_show = () => {
		audio_controller.pause_audio()
		audio_controller.play_audio("audio_intro_box_expand")
		$(".avatar_container .intro_box").show()
		$(".avatar_container .intro_box").animate({width: '36vw'}, 400, intro_box_post_ready)
	}

	// After expansion of intro box
	const intro_box_post_ready = () => {
		audio_controller.pause_audio()
		audio_controller.play_audio("audio_intro_type")

		// Simulate the typing of introduction words
		simulate_typing( {"typing_obj": ".intro_box", "char_pos": -1})
	}

	// Simulate typing
	const simulate_typing = (params) => {
		const typing_obj = params.typing_obj
		const char_pos = params.char_pos + 1
		const type_str = $(typing_obj).data("text")

		$(typing_obj).text(type_str.substring(0, char_pos))
		if(char_pos >= type_str.length) {
			instruction_msg1_show()
		} else {
			setTimeout(simulate_typing, 70, {typing_obj, char_pos});
		}
	}

	// Show instruction message 1
	const instruction_msg1_show = () => {
		audio_controller.pause_audio()
		audio_controller.play_audio("audio_instruction_flyby1")
		const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
		$(".instruction_box .instruction_msg1").animate({"margin-left": new_left}, 200, instruction_msg2_show)
		setTimeout(() => {$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})}, 600)
	}

	// Show instruction message 2
	const instruction_msg2_show = () => {
		setTimeout(() => {audio_controller.pause_audio()}, 400)
		setTimeout(() => {audio_controller.play_audio("audio_instruction_flyby2")}, 400)
		const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
		$(".instruction_box .instruction_msg2").css({"margin-top": "1.1vw"})
		$(".instruction_box .instruction_msg2").delay(400).animate({"margin-left": new_left}, 200, click_press_touch_show)
		setTimeout(() => {$(".instruction_box .instruction_msg2").css({"margin": "1.1vw auto"})}, 1000)
	}

	// Click and Keypress event listener for intro closing
	const intro_close = () => {
		doc_event.remove_event()
		$(".click_press_touch").hide()
		$(".avatar_intro").fadeTo(400, 0, avatar_minimize)
		setTimeout(() => {$(".avatar_intro").hide()}, 1000)
	}

	// Minimizing of avatar
	const avatar_minimize = () => {
		$(".avatar_container").css({width:"27.36vw", height: "21.8vw","top": "5.7vw", "left": "36vw", "position":"absolute"})
		$(".avatar_container #avatar_img").css({"margin-top":"0"}).animate({width: '10.45vw', height: '10.45vw'}, 700)
		$(".avatar_container").animate({width: '16.5vw', height: '10.45vw', margin: "0.5vw 0.8vw", "top": "0", "left": "0"}, 700, map_module.map_intro)
		setTimeout(
			() => {
				$(".avatar_container #avatar_img").hide()
				$(".avatar_container").addClass("avatar_container_min")
			}, 600
		)
	}

	return {
		avatar_intro,
		avatar_intro_box_show,
		intro_box_post_ready,
		instruction_msg1_show,
		instruction_msg2_show,
		intro_close,
		avatar_minimize
	}
}())

// Map block module
const map_module = (function(){
	// Map introduction
	const map_intro = () => {
		$(".map_container").show()
		$(".quote_container").html("This is an Interactive Map of the tour. You can click on any location at any time and I will take you there.<br/>Press any key or Click to continue.")
		$(".quote_container").show(600)
		doc_event.add_event(map_intro_close)
	}

	// Click and Keypress event listener for map intro closing
	const map_intro_close = () => {
		doc_event.remove_event()
		$(".quote_container").hide(600)
		$(".map_container").animate({"width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"}, 600, sign_post_module.sign_post_intro)
		setTimeout(() => {
			$(".map_container").css({"background-size":  "14vw 10.45vw"}).addClass("map_container_min")
			$(".map_container_min").on("click", map_maximize)
		}, 500)
	}

	// Close overlay screen
	const close_overlay = () => {
		setTimeout(()=>{$(".map_container").css({"background-size":  "14vw 10.45vw"})}, 600);
		$(".modal_overlay").off("click")
		$(".map_container").animate({"width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"}, 600)
		$(".map_container").addClass("map_container_min")
		$(".modal_overlay").hide()
		doc_event.unsuspend_event()
		doc_event.skip_event()
		$(".map_container_min").on("click", map_maximize)
	}

	// Maximizing the map
	const map_maximize = () => {
		$(".map_container_min").off("click")
		doc_event.skip_event()
		doc_event.suspend_event()
		$(".modal_overlay").show()
		$(".map_container").removeClass("map_container_min")
		$(".map_container").css({"background-size":  "51.7vw 38.6vw"})
		$(".map_container").animate({"width": "51.7vw", "height": "38.7vw", "margin": "0.5vw 0.8vw", "top": "8vw", "left": "24vw"}, 600)
		$(".modal_overlay").on("click", close_overlay)
	}

	return {
		map_intro,
		map_intro_close,
		close_overlay,
		map_maximize
	}
}())

// Sign post block module
const sign_post_module = (function(){
	// Sign post introduction
	const sign_post_intro = () => {
		$(".quote_container").html("This shows the Current and Next location on the tour.<br/>Press any key or Click to continue.")
		$(".quote_container").show(600)
		$(".sign_post_container .sign_post_location").text("Welcome")
		$(".sign_post_container .sign_post_next").text("About Me")
		$(".sign_post_container").show()
		$(".sign_post_container").animate({"bottom": "0"},800, sign_post_red_arrow_show)
	}

	// Showing sign post red arrow
	const sign_post_red_arrow_show = () => {
		$(".sign_post_container .sign_post_red_arrow").show()
		$(".sign_post_container div").addClass("animate")
		pending_task.add_task(sign_post_red_arrow_remove)
		doc_event.add_event(sign_post_blink_post)
		$(".sign_post_next_hover").on("click", sign_post_next_click)
	}

	// Remove the sign_post_red_arrow
	const sign_post_red_arrow_remove = () => {
		$(".sign_post_container .sign_post_red_arrow").hide(300)
	}

	// Functionality of on click event for next arrow of the sign post
	const sign_post_next_click = () => {
		pending_task.execute_tasks()
		about_me_init()
	}

	// After blinking the red arrow
	const sign_post_blink_post = () => {
		if(doc_event.check_event_skip() === true) {return false}
		doc_event.remove_event()
		$(".sign_post_container div").animate({"opacity":"0"}, 600)
		$(".sign_post_container .sign_post_red_arrow").hide(400, dissolve_post_location_post)
	}

	// After hiding the text of the sign post
	const dissolve_post_location_post = () => {
		about_me_init()
	}

	return {
		sign_post_intro,
		sign_post_red_arrow_show,
		sign_post_red_arrow_remove,
		sign_post_next_click,
		sign_post_blink_post,
		dissolve_post_location_post
	}
}())

// About Me Initialization
const about_me_init = () => {
	doc_event.remove_event()
	$(".map_pointer").attr("class", "map_pointer map_pointer_about_me")
	$(".map_crosshair").attr("class", "map_crosshair map_crosshair_about_me")
	$(".sign_post_container div").animate({"opacity": "1"},600).hide()
	$(".sign_post_container .sign_post_next").text("My Strength")
	$(".sign_post_container .sign_post_location").text("About Me")
	$(".sign_post_container div").show()
	$(".quote_container").hide(600)
	$(".quote_container").text("This is how I look.").show(600)
	$(".content_display_container").show()
	$(".content_display_container .content_about_me").show()
}

// Skipper function to skip through the steps
const skipper = () => {
	// check_portrait()
		$("noscript").remove()
		$("#detect_ie").remove()
		$(".ie_block_script").remove()
	// init()
		$("#detect_portrait").remove()
		$(".not_ready").remove()
	// avatar_module.avatar_intro()
		$(".avatar_container #avatar_img").css({width: '21.8vw', height: '21.8vw', opacity: 1})
	// avatar_module.avatar_intro_box_show()
		$(".avatar_container .intro_box").show()
		$(".avatar_container .intro_box").css({width: '36vw'})
	// avatar_module.intro_box_post_ready()
	// avatar_module.instruction_msg1_show()
		$(".intro_box").text($(".intro_box").data("text"))
		$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})
	// avatar_module.instruction_msg1_flyby_post()
		$(".instruction_box .instruction_msg2").css({"margin": "0 auto", "margin-top":"1.1vw"})
	// avatar_module.instruction_msg2_flyby_post()
		$(".click_press_touch").css({"top": "37vw", "left": "72vw"}).show()
		doc_event.add_event(intro_close)
	// avatar_module.intro_close()
		$(".click_press_touch").hide()
		doc_event.remove_event()
	// avatar_module.avatar_minimize()
		$(".avatar_intro").remove()
		$(".avatar_container #avatar_img").css({"margin-top":"0", width: '10.45vw', height: '10.45vw'})
		$(".avatar_container").css({width: '16.5vw', height: '10.45vw', margin: "0.5vw 0.8vw"})
		$(".avatar_container #avatar_img").hide()
		$(".avatar_container").addClass("avatar_container_min")
	// map_module.map_intro()
		$(".map_container").show()
		$(".quote_container").html("This is an Interactive Map of the tour. You can click on any location at any time and I will take you there.<br/>Press any key or Click to continue.").show()
		doc_event.add_event(map_intro_close)
	// map_module.map_intro_close()
		doc_event.remove_event()
		$(".quote_container").hide()
		$(".map_container").css({"background-size":  "14vw 10.45vw", "width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"}).addClass("map_container_min")
		$(".map_container_min").on("click", map_module.map_maximize)
	// sign_post_module.sign_post_intro()
		$(".quote_container").html("This shows the Current and Next location on the tour.<br/>Press any key or Click to continue.").show()
		$(".sign_post_container .sign_post_location").text("Welcome")
		$(".sign_post_container .sign_post_next").text("About Me")
		$(".sign_post_container").show()
		$(".sign_post_container").css({"bottom": "0"})
	// sign_post_module.sign_post_red_arrow_show()
		$(".sign_post_container .sign_post_red_arrow").show()
		$(".sign_post_container div").addClass("animate")
		pending_task.add_task(sign_post_red_arrow_remove)
		doc_event.add_event(sign_post_blink_post)
		$(".sign_post_next_hover").on("click", sign_post_next_click)
	// // sign_post_module.sign_post_blink_post()
	// 	if(doc_event.check_event_skip() === true) {return false}
	// 	doc_event.remove_event()
	// 	$(".sign_post_container .sign_post_red_arrow").hide()
	// // sign_post_module.dissolve_post_location_post()
	// 	doc_event.remove_event()
	// 	$(".quote_container").text("This is how I look.")
	// 	$(".sign_post_container .sign_post_next").text("My Strength")
	// 	$(".sign_post_container .sign_post_location").text("About Me")
	// 	$(".content_display_container").show()
	// 	$(".content_display_container .content_about_me").show()
}
