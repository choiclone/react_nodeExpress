import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ImageZoomInOut = (props) => {
    const canvasRef = useRef();
    // gkhead.src = 'https://gingernews.co.kr/wp-content/uploads/2022/05/img_subway.png';
    // gkhead.src = SubwayImage;

    useEffect(() => {
        if (!canvasRef) return;
        axios.get("/api/ReadLinePos")
            .then((res) => {
                let arcs = [];
                const Data = res.data.test;

                let canvas = canvasRef.current;
                canvas.width = 800;
                canvas.height = 600;
                
                let gkhead = new Image();
                gkhead.src = 'https://upload.wikimedia.org/wikipedia/commons/8/85/Seoul_subway_linemap_ko.svg';
                let ctx = canvas.getContext('2d');

                gkhead.onload = () => {
                    arcs = [];
                    ctx.drawImage(gkhead, 0, 0);
                    Data.map((item, key) => {
                        arcs.push(new arc(item.lineName, item.x, item.y));
                    })
                    ctx.closePath();
                }
                trackTransforms(ctx); 

                var arc = (() => {
                    function arc(name, x, y, fill, stroke) {
                        this.x = x;
                        this.y = y;
                        this.width = 50;
                        this.height = 30;
                        this.name = name;
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

                    // arc.prototype.highlight = function (x, y) {
                    //     this.x = x || this.x;
                    //     this.y = y || this.y;
                    //     this.draw("green");
                    //     return (this);
                    // }
                    
                    arc.prototype.draw = function (stroke) {
                        ctx.beginPath();
                        ctx.fillStyle = this.fill;
                        ctx.strokeStyle = stroke;
                        ctx.lineWidth = 10;
                        ctx.arc(this.x, this.y, 10, 0, Math.PI*2, true);
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
                    // Clear the entire canvas
                    let p1 = ctx.transformedPoint(0, 0);
                    let p2 = ctx.transformedPoint(canvas.width, canvas.height);
                    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
        
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();
        
                    ctx.drawImage(gkhead, 0, 0);
                    Data.map((item, key) => {
                        arcs.push(new arc(item.lineName, item.x, item.y));
                    })
                    ctx.closePath();
                }
                redraw();
        
                canvas.addEventListener('mousedown', (evt) => {
                    // evt = evt || window.event;
                    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    if ("which" in evt) {
                        if (evt.which === 3) {
                            PositionCretae(lastX, lastY)
                        } else {
                            dragStart = ctx.transformedPoint(lastX, lastY);
                            dragged = false;
                        }
                    }
                }, false);
        
                canvas.addEventListener('contextmenu', (evt) => {
                    evt.preventDefault()
                })
        
                canvas.addEventListener("mouseleave", (evt) => {
                    dragStart = null;
                    dragged = false;
                }, false)
        
                canvas.addEventListener('mousemove', (evt) => {
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    dragged = true;
                    if (dragStart) {
                        var pt = ctx.transformedPoint(lastX, lastY);
                        ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                        redraw();
                    }
                }, false);
        
                canvas.addEventListener('mouseup', (evt) => {
                    dragStart = null;
                }, false);

                canvas.addEventListener('click', (evt) => {
                    var clicked = "";
                    lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                    lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                    var pt = ctx.transformedPoint(lastX, lastY);
                    for (var i = 0; i < arcs.length; i++) {
                        if (arcs[i].isPointInside(pt.x, pt.y)) {
                            clicked += arcs[i].name + " "
                        }
                    }
                    if (clicked.length > 0) {
                        console.log("Clicked rectangles: " + clicked);
                    }
                }, false);
        
                var scaleFactor = 1.1;
        
                function zoom(clicks) {
                    var pt = ctx.transformedPoint(lastX, lastY);
                    ctx.translate(pt.x, pt.y);
                    var factor = Math.pow(scaleFactor, clicks);
                    ctx.scale(factor, factor);
                    ctx.translate(-pt.x, -pt.y);
                    redraw();
                }
        
                function handleScroll(evt) {
                    var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
                    if (delta) zoom(delta);
                    return evt.preventDefault() && false;
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

    const PositionCretae = async (x, y) => {
        console.log(x, y)
        // await axios.post("/api/AddLinePos", { x: x, y, y })
        //     .then((res) => {
        //         console.log(res.data.test);
        //     }).catch((err) => {
        //         console.error(err);
        //     });
    }

    return (
        <>
            <LineCanvas ref={canvasRef}></LineCanvas>
        </>
    );
}

const LineCanvas = styled.canvas`
    display: inline-block;
    border: 4px solid #1b5ac2
`

export default ImageZoomInOut;