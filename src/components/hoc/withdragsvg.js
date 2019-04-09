import React, { PureComponent } from 'react';



function withDragSVG(WrappedComponent){


    return class extends PureComponent{
        constructor(props, ref){
            super(props, ref);

            console.log(ref);
    
            this.dragging = false;
    
            this.tlgOnDragStart = props.tlgOnDragStart;
            this.tlgOnDragMove = props.tlgOnDragMove;
            this.tlgOnDragEnd = props.tlgOnDragEnd;
    
            this.onTouchMove = this.onTouchMove.bind(this);
            this.onTouchStart = this.onTouchStart.bind(this);
            this.onTouchEnd = this.onTouchEnd.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
            this.onMouseLeave = this.onMouseLeave.bind(this);
            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);
            this.onRef = this.onRef.bind(this);
        }
    
    
        onTouchStart(e){
            const { onTouchStart } = this.props;
            this.dragging = true;

            let movementX = 0;
            let movementY = 0;

            let clientX = 0;
            let clientY = 0;
            if (e.changedTouches[0]){
              clientX = e.changedTouches[0].clientX;
              clientY = e.changedTouches[0].clientY;
            }

            this.prevTouch = {};
            this.prevTouch.clientX = clientX;
            this.prevTouch.clientY = clientY;            

            if (this.tlgOnDragStart){
                this.tlgOnDragStart({movementX, movementY, clientX, clientY});
            }
            if (onTouchStart){
                onTouchStart(e);
            }
        }
    
        onTouchMove(e){
            const {onTouchMove} = this.props;
    
            if (this.dragging !== true && !this.tlgOnDragMove ){
                return;
            }
    
            let movementX = 0;
            let movementY = 0;
            if (this.prevTouch){
              movementX = -(this.prevTouch.clientX || 0) + e.changedTouches[0].clientX;
              movementY = -(this.prevTouch.clientY || 0) + e.changedTouches[0].clientY;
            } else {
              this.prevTouch = {};
            }
            let clientX = 0;
            let clientY = 0;
            if (e.changedTouches[0]){
              clientX = e.changedTouches[0].clientX;
              clientY = e.changedTouches[0].clientY;
            }
            this.prevTouch.clientX = clientX;
            this.prevTouch.clientY = clientY;
    
            if (this.tlgOnDragMove){
                this.tlgOnDragMove({movementX, movementY, clientX, clientY});
            }
            if (onTouchMove){
                onTouchMove(e);
            }
        }
    
        onTouchEnd(e){
            const { onTouchEnd } = this.props;
            this.dragging = false;
            let movementX = 0;
            let movementY = 0;

            let clientX = 0;
            let clientY = 0;
            if (e.changedTouches[0]){
              clientX = e.changedTouches[0].clientX;
              clientY = e.changedTouches[0].clientY;
            }             
            if (this.tlgOnDragEnd){
                this.tlgOnDragEnd({movementX, movementY, clientX, clientY});
            }
            if (onTouchEnd){
                onTouchEnd(e);
            }
        }
    
    
        onMouseMove(e){
            const { onMouseMove } = this.props;
            const {movementX, clientX, movementY, clientY} = e;
            e.preventDefault();
            if ((this.dragging !== false) && this.tlgOnDragMove ){
                this.tlgOnDragMove({movementX, movementY, clientX, clientY});
            }
            if (onMouseMove){
                onMouseMove(e);
            }
        }
    
        onMouseLeave(e){
            const {onMouseLeave} = this.props;
            const {movementX, clientX, movementY, clientY} = e;
            e.preventDefault();
            this.dragging = false;
            if (this.tlgOnDragEnd){
                this.tlgOnDragEnd({movementX, clientX, movementY, clientY});
            }
            if (onMouseLeave) {
                onMouseLeave(e);
            }
        }
    
        onMouseUp(e){
            const { onMouseUp } = this.props;
            const {movementX, clientX, movementY, clientY} = e;
            e.preventDefault();
            this.dragging = false;
            if (this.tlgOnDragEnd){
                this.tlgOnDragEnd({movementX, clientX, movementY, clientY});
            }       
            if (onMouseUp){
                onMouseUp(e);
            }
        }    
    
        onMouseDown(e){
            const { onMouseDown } = this.props;
            const {movementX, clientX, movementY, clientY} = e;
            e.preventDefault();
            this.dragging = true;
            if (this.tlgOnDragStart){
                this.tlgOnDragStart({movementX, clientX, movementY, clientY});
            }
            if (onMouseDown){
                onMouseDown(e);
            }
        }
    
        onRef(el){
            const { ref } = this.props;
            this.SVG = el;
            if ( ref ){
                ref(el);
            }
        }
    
    
        render(){
            const { children } = this.props;
            const props = {...this.props}
    
            delete props.ref;
            delete props.onTouchMove;
            delete props.onTouchStart;
            delete props.onTouchEnd;
            delete props.onMouseMove;
            delete props.onMouseLeave;
            delete props.onMouseDown;
            delete props.onMouseUp;
    
            return (
                <WrappedComponent
                    ref={ this.onRef }
                    onTouchMove={ this.onTouchMove  } 
                    onTouchStart={ this.onTouchStart }
                    onTouchEnd={ this.onTouchEnd }
    
                    onMouseMove={ this.onMouseMove  }
                    onMouseLeave={ this.onMouseLeave  }
                    onMouseDown={ this.onMouseDown }
                    onMouseUp={ this.onMouseUp }
                    {...props}
                >
                    {children}
                </WrappedComponent>
            );
        }
    }


}



export default withDragSVG;