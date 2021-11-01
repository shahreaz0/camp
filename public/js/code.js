// CKEditor editor
ClassicEditor.create(document.querySelector("#add-book-textarea")).catch((error) =>
	console.error(error),
);

ClassicEditor.create(document.querySelector("#edit-book-textarea")).catch((error) =>
	console.error(error),
);

// Close Flash message
$(".message .close").on("click", function () {
	$(this).closest(".message").transition("fade");
});

// toast
const errorMsg = document.getElementById("error-message")?.dataset.msg || "error";
const successMsg = document.getElementById("success-message")?.dataset.suc || "success";

let headMsg = "";

switch (errorMsg) {
	case "You are not logged in":
		headMsg = "Please, Login";
		break;
	case "You can't edit other's post.":
		headMsg = "Permission denied";
		break;
}

$("#error-toast").toast({
	title: headMsg,
	message: errorMsg,
	showProgress: "bottom",
	displayTime: 4000,
	position: "top center",
	classProgress: "red",
});

switch (successMsg) {
	case "You are not logged in":
		headMsg = "Please, Login";
		break;
}

$("#success-toast").toast({
	message: successMsg,
	showProgress: "bottom",
	displayTime: 3000,
	position: "top center",
	classProgress: "green",
});

// tippy.js
tippy("#tooltip", {});

// user like
const likeIcons = document.querySelectorAll(".heart");
const likesText = document.querySelectorAll(".like-section");

for (let icon of likeIcons) {
	icon.addEventListener("click", async function (e) {
		const bookid = this.dataset.bookid;
		const userid = this.dataset.userid;

		this.classList.toggle("outline");

		const option = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userid }),
		};

		const response = await fetch(`/camps/${bookid}/like`, option);
		const data = await response.json();

		for (let text of likesText) {
			if (text.dataset.span === bookid) text.textContent = data.likes + " likes";
		}
	});
}
