import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.5;

const ImageZoomInOut = (props) => {
    const [subInfo, setSubInfo] = useState([]);
    const [subInfos, setSubInfos] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const canvasRef = useRef();
    const gkhead = new Image();

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    useEffect(() => {
        if (canvasRef.current === undefined) return;
        let canvas = canvasRef.current;
        canvas.width = 1000;
        canvas.height = 700;

        gkhead.src = "https://upload.wikimedia.org/wikipedia/commons/8/85/Seoul_subway_linemap_ko.svg";
        gkhead.width = 5000;
        gkhead.height = 6000;

        let ctx = canvas.getContext('2d');
        gkhead.onload = function () {
            ctx.drawImage(gkhead, canvas.width/2 - gkhead.width/2, canvas.height/2 - gkhead.height/2);
        }
        axios.get("/api/ReadLinePos")
            .then((res) => {
                let arcs = [];
                const Data = res.data.test;

                const imgPosX = canvas.width/2 - gkhead.width/2;
                const imgPosY = canvas.height/2 - gkhead.height/2;

                gkhead.onload = () => {
                    arcs = [];
                    ctx.drawImage(gkhead, imgPosX, imgPosY);
                    Data.map((item, key) => {
                        arcs.push(new arc(item.subwayCode, item.subwayStation, (item.PosX + imgPosX), (item.PosY + imgPosY), item.lineName));
                    })
                    ctx.closePath();
                }
                trackTransforms(ctx);

                const arc = (() => {
                    function arc(code, name, x, y, line, fill, stroke) {
                        this.x = (x - 10);
                        this.y = (y - 10);
                        this.width = 20;
                        this.height = 20;
                        this.name = name;
                        this.code = code
                        this.line = line;
                        this.fill = fill || "white";
                        this.stroke = stroke || "black";
                        this.redraws(this.x, this.y);
                        return (this);
                    }

                    arc.prototype.redraws = function (x, y) {
                        this.x = x || this.x;
                        this.y = y || this.y;
                        this.draw(this.stroke);
                        return (this);
                    }

                    arc.prototype.highlight = function (x, y) {
                        this.x = x || this.x;
                        this.y = y || this.y;
                        this.draw("green");
                        return (this);
                    }

                    arc.prototype.draw = function (stroke) {
                        ctx.beginPath();
                        ctx.fillStyle = this.fill;
                        ctx.strokeStyle = stroke;
                        ctx.lineWidth = 5;
                        ctx.arc(this.x + 10, this.y + 10, 15, 0, Math.PI * 2, true);
                        // ctx.rect(this.x, this.y, this.width, this.height);
                        ctx.stroke();
                        ctx.fill();
                    }

                    arc.prototype.isPointInside = function (x, y) {
                        return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
                    }

                    return arc;
                })();

                let lastX = canvas.width / 2, lastY = canvas.height / 2;

                let dragStart, dragged;

                function redraw() {
                    arcs = [];
                    let p1 = ctx.transformedPoint(0, 0);
                    let p2 = ctx.transformedPoint(canvas.width, canvas.height);
                    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();

                    ctx.drawImage(gkhead, imgPosX, imgPosY);
                    Data.map((item, key) => {
                        arcs.push(new arc(item.subwayCode, item.subwayStation, (item.PosX + imgPosX), (item.PosY + imgPosY), item.lineName));
                    })
                    ctx.closePath();
                }
                redraw();

                canvas.addEventListener('mousedown', (evt) => {
                    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    if ("which" in evt) {
                        if (evt.which === 3) {
                            PositionCretae(evt.clientX, evt.clientY)
                        } else {
                            dragStart = ctx.transformedPoint(lastX, lastY);
                            dragged = false;
                        }
                    }
                }, false);

                canvas.addEventListener('contextmenu', (evt) => evt.preventDefault());

                canvas.addEventListener("mouseleave", (evt) => {
                    dragStart = null;
                    dragged = false;
                }, false);

                canvas.addEventListener('mousemove', (evt) => {
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    var pt = ctx.transformedPoint(lastX, lastY);
                    for (var i = 0; i < arcs.length; i++) {
                        if (arcs[i].isPointInside(pt.x, pt.y)) {
                            arcs[i].highlight();
                        } else {
                            arcs[i].redraws();
                        }
                    }
                    dragged = true;
                    if (dragStart) {
                        var pt = ctx.transformedPoint(lastX, lastY);
                        ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                        redraw();
                    }
                }, false);

                canvas.addEventListener('mouseup', () => { dragStart = null }, false);

                canvas.addEventListener('click', (evt) => {
                    var clicked = "";
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    var pt = ctx.transformedPoint(lastX, lastY);
                    for (var i = 0; i < arcs.length; i++) {
                        if (arcs[i].isPointInside(pt.x, pt.y)) {
                            clicked += arcs[i].name + "_" + arcs[i].code + "_" + arcs[i].line + "_";
                        }
                    }
                    if (clicked.length > 0) {
                        ImagePosition(clicked);
                    }
                }, false);

                const zoom = (factors) => {
                    var pt = ctx.transformedPoint(lastX, lastY);
                    ctx.translate(pt.x, pt.y);
                    ctx.scale(factors, factors);
                    ctx.translate(-pt.x, -pt.y);
                    redraw();
                }

                const handleScroll = (e) => {
                    var delta = e.deltaY ? e.wheelDeltaY / 40 : e.detail ? -e.detail : 0;
                    if (delta) zoom(clamp((1 + e.wheelDeltaY * SCROLL_SENSITIVITY), MIN_ZOOM, MAX_ZOOM));
                    return e.preventDefault() && false;
                };

                canvas.addEventListener('DOMMouseScroll', handleScroll, false);
                canvas.addEventListener('mousewheel', handleScroll, false);

                function trackTransforms(ctx) {
                    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
                    var xform = svg.createSVGMatrix();
                    ctx.getTransform = function () { return xform; };

                    var savedTransforms = [];
                    var save = ctx.save;
                    ctx.save = function () {
                        savedTransforms.push(xform.translate(0, 0));
                        return save.call(ctx);
                    };

                    var restore = ctx.restore;
                    ctx.restore = function () {
                        xform = savedTransforms.pop();
                        return restore.call(ctx);
                    };

                    var scale = ctx.scale;
                    ctx.scale = function (sx, sy) {
                        xform = xform.scaleNonUniform(sx, sy);
                        return scale.call(ctx, sx, sy);
                    };

                    var rotate = ctx.rotate;
                    ctx.rotate = function (radians) {
                        xform = xform.rotate(radians * 180 / Math.PI);
                        return rotate.call(ctx, radians);
                    };

                    var translate = ctx.translate;
                    ctx.translate = function (dx, dy) {
                        xform = xform.translate(dx, dy);
                        return translate.call(ctx, dx, dy);
                    };

                    var transform = ctx.transform;
                    ctx.transform = function (a, b, c, d, e, f) {
                        var m2 = svg.createSVGMatrix();
                        m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
                        xform = xform.multiply(m2);
                        return transform.call(ctx, a, b, c, d, e, f);
                    };

                    var setTransform = ctx.setTransform;
                    ctx.setTransform = function (a, b, c, d, e, f) {
                        xform.a = a;
                        xform.b = b;
                        xform.c = c;
                        xform.d = d;
                        xform.e = e;
                        xform.f = f;
                        return setTransform.call(ctx, a, b, c, d, e, f);
                    };

                    var pt = svg.createSVGPoint();
                    ctx.transformedPoint = function (x, y) {
                        pt.x = x; pt.y = y;
                        return pt.matrixTransform(xform.inverse());
                    }
                }
            }).catch((err) => {
                console.log(err)
            });

    }, [canvasRef]);

    document.addEventListener('contextmenu', (evt) => {
        evt.preventDefault()
    })

    const PositionCretae = async (x, y) => {
        console.log(x, y);
    }

    const ImagePosition = async (clickList) => {
        const subwayName = clickList.split("_")[0];
        const subwayCode = clickList.split("_")[1].split(",");
        const subwayLine = clickList.split("_")[2].split(",");

        let list = [];
        list.push({
            name: subwayName,
            codes: subwayCode,
            lines: subwayLine
        });
        await setTimeout(() => {
            setSubInfo(list);
            setOpenModal(true);
            axios.post("/api/SubwayLiveList", { stationName: subwayName })
                .then((res) => {
                    if (res.data.code === 200) {
                        setSubInfos(res.data.subwayList["realtimeArrivalList"]);
                    }
                }).catch((err) => {

                })
        }, 100);
    }

    const LineInfo = (code) => {
        console.log(code);
    }

    return (
        <>
            <div className={'map-subway-div'}>
                <canvas
                    className='map-canvasImg'
                    ref={canvasRef}
                />
                {
                    openModal ?
                        <div className='canvas-modal-back'>
                            <div className='canvas-modal-front'>
                                <div className='map-header-modal'>
                                    <i className='fa fa-close' onClick={() => setOpenModal(false)} />
                                </div>
                                {
                                    subInfo.length !== 0 ?
                                        Object.keys(subInfo).map((item, key) => (
                                            <div key={key}>
                                                {subInfo[item].name}
                                                <div>{
                                                    subInfo[item].codes.map((i, key) => (
                                                        <button key={key} onClick={() => LineInfo(subInfo[item].codes[key])}>{subInfo[item].lines[key]}</button>
                                                    ))
                                                }</div>
                                            </div>
                                        )) : ""
                                }
                                <div>
                                    {
                                        subInfos.length !== 0 ?
                                            subInfos.map((item, key) => (
                                                    <p>{item.statnFid}/{item.statnTid}</p>
                                            )) : ""
                                    }
                                </div>
                            </div>
                        </div>
                        : ""
                }
                {/* <form>
                    <input type="text"></input>
                    <input type="text"></input>
                    <button type="submit">길찾기</button>
                </form> */}
            </div>
        </>
    );
}

export default ImageZoomInOut;