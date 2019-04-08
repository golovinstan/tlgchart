import React, { PureComponent } from 'react';



class CommonSVG extends PureComponent{
    constructor(props){
        super(props);

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
    }


    onTouchStart(e){
        this.dragging = true;
        if (this.tlgOnDragStart){
            this.tlgOnDragStart();
        }
    }

    onTouchMove(e){

        if (this.dragging !== true && !this.tlgOnDragMove ){
            return;
        }

        let movementX = 0;
        let movementY = 0;
        if (this.prevTouch){
          movementX = (this.prevTouch.clientX || 0) - e.changedTouches[0].clientX;
          movementY = (this.prevTouch.clientY || 0) - e.changedTouches[0].clientY;
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

        this.tlgOnDragMove({movementX, movementY, clientX, clientY});
    }

    onTouchEnd(e){
        this.dragging = false;
        if (this.tlgOnDragEnd){
            this.tlgOnDragEnd();
        }
    }


    onMouseMove(e){
        const {movementX, clientX, movementY, clientY} = e;
        if (this.dragging){
            this.tlgOnDragMove({movementX, movementY, clientX, clientY});
        }        
    }

    onMouseLeave(e){
        e.preventDefault();
        this.dragging = false;
        if (this.tlgOnDragEnd){
            this.tlgOnDragEnd();
        }                
    }

    onMouseUp(e){
        e.preventDefault();
        this.dragging = false;
        if (this.tlgOnDragEnd){
            this.tlgOnDragEnd();
        }                
    }    

    onMouseDown(e){
        e.preventDefault();
        this.dragging = true;
        if (this.tlgOnDragStart){
            this.tlgOnDragStart();
        }
    }


    render(){
        const { children } = this.props;
        return (
            <svg
                ref={ el => this.SVG = el }
                onTouchMove={ this.onTouchMove  } 
                onTouchStart={ this.onTouchStart }
                onTouchEnd={ this.onTouchEnd }

                onMouseMove={ this.onMouseMove  }
                onMouseLeave={ this.onMouseLeave  }
                onMouseDown={ this.onMouseDown }
                onMouseUp={ this.onMouseUp }                  
            >
                {children}
            </svg>
        );
    }
}

export default CommonSVG;