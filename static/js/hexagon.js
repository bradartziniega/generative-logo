var hexagon = {

  numVertices: 6,
  pointObj: {'x':0, 'y':0},
  defaultColors: ["rgba(183,61,129,0.75)","rgba(132,32,92,0.75)","rgba(197,128,177,0.5)","rgba(156,52,110,0.66)","rgba(56,167,123,0.8)","rgba(66,196,144,0.5)","rgba(68,204,192,0.4)","rgba(144,199,203,0.6)","rgba(78,206,155,0.8)"],

  init: function(){


  },

  drawEverything: function(){ 
    var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      number_master_triangles = 2,
      i = this.numVertices,
      triangle_master_array = new Array(number_master_triangles),
      triangles_master = {},
      vertices = new Array(i),
      x, y;

      triangles_master.vertices = [];
      triangle_master_array[0] = triangles_master;
      triangle_master_array[1] = triangles_master;

    var angle = 60*Math.PI/180;
    var l = (canvas.height/(2*Math.cos(angle)+1));

    //creates circlular bounds
    //setting hexagon outline
    for(var j=0;j<number_master_triangles;j++){

      triangle_master_array[j].vertices[0] = {x: 0.5*canvas.width, y: 0};
      triangle_master_array[j].vertices[1] = {x: 0.5*canvas.width + l*Math.sin(angle), y: l*Math.cos(angle) };
      triangle_master_array[j].vertices[2] = {x: 0.5*canvas.width + l*Math.sin(angle), y: l*Math.cos(angle)+l};
      triangle_master_array[j].vertices[3] = {x: 0.5*canvas.width, y: canvas.height};
      triangle_master_array[j].vertices[4] = {x: 0.5*canvas.width - l*Math.sin(angle), y: l*Math.cos(angle)+l};
      triangle_master_array[j].vertices[5] = {x: 0.5*canvas.width - l*Math.sin(angle), y: l*Math.cos(angle)};
    
      poly_points = [triangle_master_array[j].vertices[0],triangle_master_array[j].vertices[1],triangle_master_array[j].vertices[2],triangle_master_array[j].vertices[3],triangle_master_array[j].vertices[4],triangle_master_array[j].vertices[5]];

      var numPoints = 0;

      while(numPoints<3){

        curPoint = {x: 0, y: 0};
        while(!this.isPointInPoly(poly_points,curPoint)){
          curPoint = {x: 0.5*canvas.width-400 + Math.floor(Math.random()*800), y: 0.5*canvas.width-400 + Math.floor(Math.random()*800)};
        }

        triangle_master_array[j].vertices[6+numPoints] = curPoint;
        numPoints++;
      }


      console.time("triangulate")
      triangle_master_array[j].triangles = this.triangulate(triangle_master_array[j].vertices);

      console.timeEnd("triangulate")

      i = triangle_master_array[j].triangles.length;
      console.log ("#Triangles: " + i);
      while(i)
        this.drawTriangle(triangle_master_array[j].triangles[--i],ctx,i,triangle_master_array[j].triangles.length);
    }
    
  },

  isPointInPoly: function(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
  },


  

  getInfo: function(){

      return this.numVertices;

  },


  Triangle: function(a,b,c){

    this.a = a
    this.b = b
    this.c = c

    var A = b.x - a.x,
        B = b.y - a.y,
        C = c.x - a.x,
        D = c.y - a.y,
        E = A * (a.x + b.x) + B * (a.y + b.y),
        F = C * (a.x + c.x) + D * (a.y + c.y),
        G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
        minx, miny, dx, dy

    /* If the points of the triangle are collinear, then just find the
     * extremes and use the midpoint as the center of the circumcircle. */
    if(Math.abs(G) < 0.000001) {
      minx = Math.min(a.x, b.x, c.x)
      miny = Math.min(a.y, b.y, c.y)
      dx   = (Math.max(a.x, b.x, c.x) - minx) * 0.5
      dy   = (Math.max(a.y, b.y, c.y) - miny) * 0.5

      this.x = minx + dx
      this.y = miny + dy
      this.r = dx * dx + dy * dy
    }

    else {
      this.x = (D*E - B*F) / G
      this.y = (A*F - C*E) / G
      dx = this.x - a.x
      dy = this.y - a.y
      this.r = dx * dx + dy * dy
    }
    

  },

  drawTriangle: function(curTriangle,ctx,index,length){

    colorValue = this.map(index, 0, length, 0, 255);
    //hexColorValue = this.rgbToHex(colorValue,colorValue,colorValue);

    var lingrad = ctx.createLinearGradient(curTriangle.a.x,curTriangle.a.y,curTriangle.b.x,curTriangle.b.y);

    var randomnumber=Math.floor(Math.random()*this.defaultColors.length);
    var randomnumber2 = Math.floor(Math.random()*this.defaultColors.length);


    //lingrad.addColorStop(0,this.defaultColors[randomnumber]);
    //lingrad.addColorStop(1,this.defaultColors[randomnumber2]);
    //ctx.fillStyle = lingrad;
    ctx.fillStyle   = this.defaultColors[randomnumber];
   
    ctx.strokeStyle
    ctx.beginPath();
    ctx.moveTo(curTriangle.a.x, curTriangle.a.y);
    ctx.lineTo(curTriangle.b.x, curTriangle.b.y);
    ctx.lineTo(curTriangle.c.x, curTriangle.c.y);
    ctx.fill();
    ctx.closePath();
    //ctx.stroke();

  },



  

  rgbToHex: function(R,G,B){
    return this.toHex(R)+this.toHex(G)+this.toHex(B);
  },

  toHex: function(n){
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)+ "0123456789ABCDEF".charAt(n%16);
  },

  byX: function(a, b) {
    return b.x - a.x
  },

  map: function (value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  },

//cleans up double edges
  dedup: function(edges) {
    var j = edges.length,
        a, b, i, m, n

    outer: while(j) {
      b = edges[--j]
      a = edges[--j]
      i = j
      while(i) {
        n = edges[--i]
        m = edges[--i]
        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2)
          edges.splice(i, 2)
          j -= 2
          continue outer
        }
      }
    }
  },

  triangulate: function(vertices) {
    /* Bail if there aren't enough vertices to form any triangles. */
    if(vertices.length < 3)
      return []

    /* Ensure the vertex array is in order of descending X coordinate
     * (which is needed to ensure a subquadratic runtime), and then find
     * the bounding box around the points. */
    vertices.sort(this.byX)

    var i    = vertices.length - 1,
        xmin = vertices[i].x,
        xmax = vertices[0].x,
        ymin = vertices[i].y,
        ymax = ymin

    while(i--) {
      if(vertices[i].y < ymin) ymin = vertices[i].y
      if(vertices[i].y > ymax) ymax = vertices[i].y
    }

    /* Find a supertriangle, which is a triangle that surrounds all the
     * vertices. This is used like something of a sentinel value to remove
     * cases in the main algorithm, and is removed before we return any
     * results.
     * 
     * Once found, put it in the "open" list. (The "open" list is for
     * triangles who may still need to be considered; the "closed" list is
     * for triangles which do not.) */
    var dx     = xmax - xmin,
        dy     = ymax - ymin,
        dmax   = (dx > dy) ? dx : dy,
        xmid   = (xmax + xmin) * 0.5,
        ymid   = (ymax + ymin) * 0.5,
        open   = [
          new this.Triangle(
            {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
            {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
            {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
          )
        ],
        closed = [],
        edges = [],
        j, a, b

    /* Incrementally add each vertex to the mesh. */
    i = vertices.length
    while(i--) {
      /* For each open triangle, check to see if the current point is
       * inside it's circumcircle. If it is, remove the triangle and add
       * it's edges to an edge list. */
      edges.length = 0
      j = open.length
      while(j--) {
        /* If this point is to the right of this triangle's circumcircle,
         * then this triangle should never get checked again. Remove it
         * from the open list, add it to the closed list, and skip. */
        dx = vertices[i].x - open[j].x
        if(dx > 0 && dx * dx > open[j].r) {
          closed.push(open[j])
          open.splice(j, 1)
          continue
        }

        /* If not, skip this triangle. */
        dy = vertices[i].y - open[j].y
        if(dx * dx + dy * dy > open[j].r)
          continue

        /* Remove the triangle and add it's edges to the edge list. */
        edges.push(
          open[j].a, open[j].b,
          open[j].b, open[j].c,
          open[j].c, open[j].a
        )
        open.splice(j, 1)
      }

      /* Remove any doubled edges. */
      this.dedup(edges)

      /* Add a new triangle for each edge. */
      j = edges.length
      while(j) {
        b = edges[--j]
        a = edges[--j]
        open.push(new this.Triangle(a, b, vertices[i]))
      }
    }

    /* Copy any remaining open triangles to the closed list, and then
     * remove any triangles that share a vertex with the supertriangle. */
    Array.prototype.push.apply(closed, open)

    i = closed.length
    while(i--)
      if(closed[i].a.__sentinel ||
         closed[i].b.__sentinel ||
         closed[i].c.__sentinel)
        closed.splice(i, 1)

    /* Yay, we're done! */
    return closed
  }


}



