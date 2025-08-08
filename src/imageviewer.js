const imageviewer = {
    elems: null,
    __imageContainerElem: null,
    __imageviewerElem: null,
    __btnEventListeners: null,
    __isLoading: false,
    __curImgElem: null,
    __spinnerElem: null,
    __curIndex: null,

    __injectIntoDom: function () {
        document.body.insertAdjacentHTML("beforeend", `
            <div id="imageviewer" class="imageviewer">
                <div class="imageviewer__background"></div>
                <div class="imageviewer__controls">
                    <div class="imageviewer__close"><i class="fa-solid fa-xmark"></i></div>
                    <div class="imageviewer__arrows">
                        <div class="imageviewer__prev"><i class="fa-solid fa-arrow-left"></i></div>
                        <div class="imageviewer__next"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                </div>
                <div class="imageviewer__container">
                    <img class="imageviewer__image__previous" src="https://placehold.co/600x400" alt="Previous image not loaded yet">
                    <img class="imageviewer__image__current" src="https://placehold.co/600x400" alt="Current image not loaded yet">
                    <div class="spinner-container">
                        <i class="spinner fa-solid fa-spinner fa-spin-pulse"></i>
                    </div>
                    <img class="imageviewer__image__next" src="https://placehold.co/600x400" alt="Next image not loaded yet">
                </div>
            </div>
        `);

        this.__imageviewerElem = document.getElementById("imageviewer");
        this.__imageContainerElem = this.__imageviewerElem.querySelector(".imageviewer__container");
        document.querySelector(".imageviewer__close").addEventListener("click", this.__hideImage.bind(this));

        this.elems = [...document.querySelectorAll("[data-viewableimage]")];

        this.eventListeners = this.elems.map((elem, index) => {
            elem.addEventListener("click", (event) => {
                event.preventDefault();
                this.__showImage(index);
                this.__curIndex = index;
            });
        });

        this.__curImgElem = this.__imageviewerElem.querySelector(".imageviewer__image__current");
        this.__curImgElem.addEventListener("load", () => {
            this.__curImgElem.style.display = null;
            this.__imageviewerElem.querySelector(".spinner-container").style.display = "none";
            this.__isLoading = false;
        });

        this.__spinnerElem = this.__imageviewerElem.querySelector(".spinner-container");

        this.__imageviewerElem.querySelector(".imageviewer__prev").addEventListener("click", () => this.__prevImage.bind(this)());
        this.__imageviewerElem.querySelector(".imageviewer__next").addEventListener("click", () => this.__nextImage.bind(this)());
    },

    init: function () {
        if (this.__imageviewerElem === null) {
            this.__injectIntoDom();
            this.__addEventListeners();
        }
    },

    __addEventListeners: function () {
        window.addEventListener("keydown", (event) => {
            if (!this.__imageviewerElem.classList.contains("imageviewer__visible")) {
                return;
            }
            if (event.key === "Escape") {
                this.__hideImage();
            } else if (event.key === "ArrowLeft") {
                this.__prevImage();
            } else if (event.key === "ArrowRight") {
                this.__nextImage();
            }
        });
    },

    __getElemData: function (elem) {
        let src = elem.getAttribute("src");
        if (elem.hasAttribute("data-viewableimage-src")) {
            src = elem.getAttribute("data-viewableimage-src");
        }
        const alt = elem.getAttribute("alt");
        const title = elem.getAttribute("title");
        return {src, alt, title};
    },

    __showImage: function (index, prevIndexOffset = 0) {
        const elem = this.elems[index];
        if (!elem || this.__isLoading) {
            return;
        }
        this.__curIndex = index;
        this.__imageContainerElem.classList.remove("animate-previous-image", "animate-next-image");

        requestAnimationFrame(() => {
            if (prevIndexOffset === 0 || ! this.elems[index - prevIndexOffset]) {
                return;
            }
            if (prevIndexOffset === 1) {
                this.__imageviewerElem.querySelector(".imageviewer__image__previous").src = this.__getElemData(this.elems[index - prevIndexOffset]).src;
                this.__imageContainerElem.classList.add("animate-next-image");
            } else {
                this.__imageviewerElem.querySelector(".imageviewer__image__next").src = this.__getElemData(this.elems[index - prevIndexOffset]).src;
                this.__imageContainerElem.classList.add("animate-previous-image");
            }
        });

        this.__imageviewerElem.classList.add("imageviewer__visible");
        document.body.classList.add("no-scroll");

        this.__curImgElem.style.display = "none";
        this.__spinnerElem.style.display = null;
        const {src, alt, title} = this.__getElemData(elem);
        this.__curImgElem.src = src;
        this.__isLoading = true;
        this.__curImgElem.alt = alt;
        this.__curImgElem.title = title;

        const btnPrev = this.__imageviewerElem.querySelector(".imageviewer__prev");
        const btnNext = this.__imageviewerElem.querySelector(".imageviewer__next");
        if (index > 0) {
            btnPrev.classList.remove("disabled");
        } else {
            btnPrev.classList.add("disabled");
        }

        if (index < this.elems.length - 1) {
            btnNext.classList.remove("disabled");
        } else {
            btnNext.classList.add("disabled");
        }
    },

    __nextImage() {
        this.__showImage(this.__curIndex + 1, 1);
    },

    __prevImage() {
        this.__showImage(this.__curIndex - 1, -1);
    },

    __hideImage: function () {
        this.__imageviewerElem.classList.remove("imageviewer__visible");
        document.body.classList.remove("no-scroll");
    },

}
imageviewer.init();
window.imageviewer = imageviewer;
