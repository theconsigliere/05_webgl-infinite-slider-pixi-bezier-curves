import * as PIXI from "pixi.js"
import img from "../img/image.jpg"

class Sketch {
  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.app = new PIXI.Application({
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      resizeTo: window,
    })

    this.scrollTarget = 0
    this.scroll = 0
    this.currentScroll = 0

    document.body.appendChild(this.app.view)
    this.app.view.style.width = this.width + "px"
    this.app.view.style.height = this.height + "px"

    this.container = new PIXI.Container()

    this.app.stage.addChild(this.container)

    this.addImages() // graphics
    this.resize()
    this.setupResize()
    this.render()
    this.scrollEvent()
  }

  scrollEvent() {
    document.addEventListener("wheel", (e) => {
      this.scrollTarget = e.wheelDelta / 3
    })
  }

  addImages() {
    let images = [img, img, img, img, img, img]
    this.slides = images.map((img) => PIXI.Sprite.from(img))

    this.objs = []
    this.margin = 300

    // create all slides with masks in the loop
    this.slides.forEach((slide, i) => {
      // get aspect ration of image
      let localContainer = new PIXI.Container()
      let aspect = 1.5
      let block = new PIXI.Sprite(PIXI.Texture.WHITE)
      block.tint = 0xff0000
      block.width = 100
      block.height = 100

      // center local container
      localContainer.pivot.x = -this.width / 2
      localContainer.pivot.y = -this.height / 2 - i * this.margin

      this.container.addChild(block)

      let image = PIXI.Sprite.from(img)
      image.width = 1000
      image.height = image.width / aspect

      // center image inside its container
      image.anchor.set(0.5)

      // create mask for image slide
      const mask = new PIXI.Graphics()

      localContainer.addChild(mask)
      localContainer.mask = mask

      // add image to local container and to global container
      localContainer.addChild(image)
      this.container.addChild(localContainer)

      // add local container to array of objects
      this.objs.push({
        container: localContainer,
        mask: mask,
        image: image,
      })
    })
  }

  updateAllTheThings() {
    this.objs.forEach((slide, i) => {
      slide.mask.clear()
      slide.mask.beginFill(0xff0000)

      let maskX = 450
      let maskY = 100
      let distortion = this.scroll
      //let distortion = this.scroll* 5
      let coefficient = 0.0

      // create an array of points to create a rectangle
      let maskPoints = [
        { x: maskX, y: -maskY }, // top
        { x: -maskX, y: -maskY }, // right
        { x: -maskX, y: maskY }, // bottom
        { x: maskX, y: maskY }, // left
      ]

      // create an array of control points for the bezier curve
      // (control points are the middle of the curve)

      if (distortion < 0) {
        // if scrolling down move corners inside
        maskPoints[2].x += Math.abs(distortion) * 0.4 // left bottom coordinates
        maskPoints[2].y -= Math.abs(distortion) * 0.4 // left bottom coordinates

        maskPoints[3].x -= Math.abs(distortion) * 0.4 // right bottom coordinates
        maskPoints[3].y -= Math.abs(distortion) * 0.4 // right bottom coordinates
      } else {
      }

      let controlPoints = [
        // top
        {
          x: 0.5 * maskPoints[0].x + 0.5 * maskPoints[1].x,
          y: 0.5 * maskPoints[0].y + 0.5 * maskPoints[1].y + distortion,
        },
        // right
        {
          x:
            0.5 * maskPoints[1].x +
            0.5 * maskPoints[2].x +
            Math.abs(distortion * coefficient), // make it less on the sides
          y: 0.5 * maskPoints[1].y + 0.5 * maskPoints[2].y,
        },
        // bottom
        {
          x: 0.5 * maskPoints[2].x + 0.5 * maskPoints[3].x,
          y: 0.5 * maskPoints[2].y + 0.5 * maskPoints[3].y + distortion,
        },
        // left
        {
          x:
            0.5 * maskPoints[3].x +
            0.5 * maskPoints[0].x -
            Math.abs(distortion * coefficient), // make it less on the sides
          y: 0.5 * maskPoints[3].y + 0.5 * maskPoints[0].y,
        },
      ]

      // draw rectangle with bezier curve
      slide.mask.moveTo(maskPoints[0].x, maskPoints[0].y)
      slide.mask.quadraticCurveTo(
        controlPoints[0].x,
        controlPoints[0].y,
        maskPoints[1].x,
        maskPoints[1].y
      )
      slide.mask.quadraticCurveTo(
        controlPoints[1].x,
        controlPoints[1].y,
        maskPoints[2].x,
        maskPoints[2].y
      )
      slide.mask.quadraticCurveTo(
        controlPoints[2].x,
        controlPoints[2].y,
        maskPoints[3].x,
        maskPoints[3].y
      )
      slide.mask.quadraticCurveTo(
        controlPoints[3].x,
        controlPoints[3].y,
        maskPoints[0].x,
        maskPoints[0].y
      )
    })
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    // this.quad.scale.set(this.width / 200, this.height / 200)
    // this.quad.position.set(this.width / 2, this.height / 2)
    this.app.view.style.width = this.width + "px"
    this.app.view.style.height = this.height + "px"
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this))
  }

  render() {
    this.app.ticker.add((delta) => {
      this.scroll -= (this.scrollTarget - this.scroll) * 0.1
      this.scroll *= 0.9
      this.direction = Math.sign(this.scroll)

      this.updateAllTheThings()
      // rotate the container!
      // use delta to create frame-independent transform
      // container.rotation -= 0.01 * delta;
      // console.log(delta)
    })
  }
}

new Sketch()
