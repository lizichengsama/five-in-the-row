$(function () {
    var canvas=$('#canvas').get(0)
    var ctxLeft=canvas.getContext('2d')
    var ROW=15;     //行数
    var ROL=15;     //列数
    var width=canvas.width;    //棋盘宽度
    var height=canvas.height;    //棋盘高度
    var off=width/ROW          //宽度间隔
    var offs=height/ROL         //高度间隔
    var audio=$('audio')
    //--------画棋盘-----------------
    ctxLeft.beginPath()
    function draw() {


        function drawPan() {
            for (var i = 0; i < 15; i++) {
                ctxLeft.moveTo(off / 2 + 0.5, off / 2 + 0.5 + i * off)
                ctxLeft.lineTo(14.5 * off + 0.5, off / 2 + 0.5 + i * off)
                ctxLeft.stroke()
                ctxLeft.moveTo(offs / 2 + 0.5 + i * offs, offs / 2 + 0.5)
                ctxLeft.lineTo(offs / 2 + 0.5 + i * offs, 14.5 * offs + 0.5)
                ctxLeft.stroke()
            }
        }

        //加0.5为了控制棋盘的线宽
        drawPan()
        ctxLeft.closePath()


        function circle(x, y) {
            ctxLeft.beginPath()
            ctxLeft.arc((x + 0.5) * off, (y + 0.5) * offs, 4, 0, 2 * Math.PI);
            ctxLeft.fill();
            ctxLeft.closePath()
        }

        circle(3, 3)
        circle(3, 11)
        circle(11, 3)
        circle(11, 11)
        circle(7, 7)
    }
    draw()
    //-----------------画棋子------------------------
    var flag=true;    //开关
    var block={};     //存放已经点击的棋子的位置

    function drawqizi(x,y,z) {
        ctxLeft.save();
        ctxLeft.translate((x+0.5)*off,(y+0.5) *offs)
        ctxLeft.beginPath()
        ctxLeft.arc(0,0,15,0,2*Math.PI)
        if(z=='black'){
            var radgrad=ctxLeft.createRadialGradient(-3,-3,2,0,0,15)
            radgrad.addColorStop(0,'#fff')
            radgrad.addColorStop(0.7,'#000')
            ctxLeft.fillStyle=radgrad;
        }else{
            ctxLeft.fillStyle='#fff'
            ctxLeft.shadowOffsetX=2;
            ctxLeft.shadowOffsetY=2;
            ctxLeft.shadowBlur=2;
            ctxLeft.shadowColor='rgba(0,0,0,0.5)';
        }
        ctxLeft.fill();
        ctxLeft.closePath()
        ctxLeft.restore()
        block[x+'_'+y]=z;
        // console.log(block)
        delete blank[x+'_'+y]
        audio[0].play()
    }

    function check(position,color) {
        var num1=1;
        var num2=1;
        var num3=1;
        var num4=1;
        var table={};
        for(var i in block){
            if(block[i]==color){
                table[i]=color;
            }
        }
        // console.log(table)
        var posX=position.x;
        var posY=position.y;
        while(table[(posX+1)+'_'+posY]){
            num1++;
            posX++
        }
        posX=position.x
        posY=position.y
        while(table[(posX-1)+'_'+posY]){
            num1++;
            posX--;
        }

        posX=position.x
        posY=position.y
        while(table[posX+'_'+(posY+1)]){
            num2++;
            posY++;
        }
        posX=position.x
        posY=position.y
        while(table[posX+'_'+(posY-1)]){
            num2++;
            posY--;
        }
        posX=position.x
        posY=position.y
        while(table[(posX+1)+'_'+(posY+1)]){
            num3++;
            posX++;
            posY++;
        }
        posX=position.x
        posY=position.y
        while(table[(posX-1)+'_'+(posY-1)]){
            num3++;
            posX--;
            posY--;
        }
        posX=position.x
        posY=position.y
        while(table[(posX+1)+'_'+(posY-1)]){
            num4++;
            posX++;
            posY--;
        }
        posX=position.x
        posY=position.y
        while(table[(posX-1)+'_'+(posY+1)]){
            num4++;
            posX--;
            posY++;
        }

        // if(num1>=5||num2>=5||num3>=5||num4>=5){
        //     return true;
        // }
        return Math.max(num1,num2,num3,num4)

    }
    //分割函数，将每个棋子的坐标分开，用于标记m值
    function cutt(key) {
        var arr=key.split('_')    //将坐标从 _ 前后分开
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}   //获取到每一步的坐标
    }
    function k2o(key) {
        var arr = key.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])};
    }

    //在棋谱标记m值
    function drawText(pos,m,color) {
        ctxLeft.save()
        ctxLeft.font='15px serif'
        ctxLeft.textAlign='center';
        ctxLeft.textBaseline='middle';
        if(color=='black'){
            ctxLeft.fillStyle='#ff0022'
        }
        ctxLeft.fillText(m,(pos.x+0.5)*off,(pos.y+0.5)*off)
        ctxLeft.restore()
    }

    //生成棋谱
    function review() {
        var m=1;
        for(var i in block){
            drawText(cutt(i),m,block[i]);
            // console.log(m)
            m++;
        }
    }

    //点击放棋子

    function handleClick(e) {
        var position={x:Math.round((e.offsetX-off/2)/off),y:Math.round((e.offsetY-off/2)/offs)}
        if(block[position.x+'_'+position.y]){
            return;
        }
        if(ai){
            drawqizi(position.x,position.y,'black')
            // console.log(position.x,position.y)
            drawqizi(AIS().x,AIS().y,'white')
            // console.log(AIS().x,AIS().y)
            if(check(position,'black')>=5){
                alert('黑棋win')
                $(canvas).off('click')
                if(confirm('是否生成棋谱?')){
                    review()
                }
                return;
            }else{
                if(check(AIS(),'white')>=6){
                    alert('白棋win')
                    $(canvas).off('click')
                    if(confirm('是否生成棋谱?')){
                        review()
                    }
                    return;
                }
            }
            return;
        }

        if(flag){
            drawqizi(position.x,position.y,'black')
            if(check(position,'black')>=5){
                alert('黑棋win')
                if(confirm('是否生成棋谱?')){
                    review()
                }
                $(canvas).off('click')
                return ;
            }
            flag=false;
        }else{
            drawqizi(position.x,position.y,'white')
            if(check(position,'white')>=5){
                alert('白棋win')
                if(confirm('是否生成棋谱?')){
                    review()
                }
                $(canvas).off('click')
                return
            }
            flag=true;
        }
    }
    $(canvas).on('click',handleClick);


    //重新开始
    function restart() {
        ctxLeft.clearRect(0,0,width,width)
        draw()
        block={};
        flag=true;
        $(canvas).off('click').on('click',handleClick)
    }
    $('.restart').on('click',function () {
        restart()
    })



    //AI
    var blank={};
    var ai=false;
    for(var i=0;i<ROW;i++){
        for(var j=0;j<ROL;j++){
            blank[i+'_'+j]=true;
        }
    }
    // console.log(blank)

    $('.startAi').on('click',function () {
        $(this).toggleClass('active')
        if(ai==true){
            ai=false
        }else if(ai==false){
            ai = true;
        }
    })

    function AIS() {
        var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for(var i in blank){
            var score1=check(cutt(i),'black')
            // console.log(score1)
            var score2=check(cutt(i),'white')
            // console.log(score2)
            if(max1<score1){
                max1=score1;
                pos1=cutt(i)
            }
            if(max2<score2){
                max2=score2;
                pos2=cutt(i)
            }
            // console.log(max1)
            // console.log(max2)
        }
        if(max1>=max2){
            return pos1;
        }else{
            return pos2;
        }
        // console.log(pos1)
    }



    //秒表函数
    function miaobiao() {
        var canvasLeft = $('#canvasLeft').get(0)
        var canvasRight = $('#canvasRight').get(0)
        var ctxLeft = canvasLeft.getContext('2d')
        var ctxRight = canvasRight.getContext('2d')
        var bleft=0;
        var wright=0;


        ctxLeft.translate(100, 100)
        ctxLeft.save()
        ctxLeft.beginPath()
        ctxLeft.arc(0, 0, 100, 0, 2 * Math.PI)
        ctxLeft.stroke()
        ctxLeft.closePath()
        ctxLeft.restore()


        ctxLeft.clearRect(-100, -100, 200, 200)
        for (var i = 0; i < 60; i++) {
            ctxLeft.beginPath()
            if (i % 5 == 0) {
                ctxLeft.moveTo(0, -90)
            } else {
                ctxLeft.moveTo(0, -95)
            }
            ctxLeft.lineTo(0, -100)
            ctxLeft.stroke()
            ctxLeft.closePath()
            ctxLeft.rotate(Math.PI / 30)
        }


        function times() {
            ctxLeft.save()
            ctxLeft.beginPath()
            ctxLeft.moveTo(0, 0)
            ctxLeft.lineTo(0, -70)
            ctxLeft.rotate( 2 * Math.PI  / 360)
            ctxLeft.stroke()
            ctxLeft.closePath()
            ctxLeft.restore()
        }

        t=setInterval(function () {
            times()
        } , 1000)

        ctxRight.translate(100, 100)
        ctxRight.save()
        ctxRight.beginPath()
        ctxRight.arc(0, 0, 100, 0, 2 * Math.PI)
        ctxRight.stroke()
        ctxRight.closePath()
        ctxRight.restore()


        ctxRight.clearRect(-100, -100, 200, 200)
        for (var i = 0; i < 60; i++) {
            ctxRight.beginPath()
            if (i % 5 == 0) {
                ctxRight.moveTo(0, -90)
            } else {
                ctxRight.moveTo(0, -95)
            }
            ctxRight.lineTo(0, -100)
            ctxRight.stroke()
            ctxRight.closePath()
            ctxRight.rotate(Math.PI / 30)
        }


        // function times() {

        ctxRight.save()
        ctxRight.beginPath()
        ctxRight.moveTo(0, 0)
        ctxRight.lineTo(0, -70)
        ctxRight.rotate(2 * Math.PI  / 360)
        ctxRight.stroke()
        ctxRight.closePath()
        ctxRight.restore()
        // }

        // setInterval(times, 1000)

    }
    miaobiao()

    $('.starts .start-btn').on('click',function () {
        $('.starts').slideUp()
    })



})