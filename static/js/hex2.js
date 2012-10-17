var HEX = window.HEX || {};

HEX.controller = 0;
HEX.canvas = 0;
HEX.drawctx = 0;
HEX.ctx = 0;
HEX.initialized = false;
HEX.poly_points = new Array();
HEX.padded_points = new Array();
HEX.triangle_master_array = new Array();

HEX.constants = {
  padded_distance: 1,
  numVertices: 6,
  number_master_triangles: 2,
  number_internal_points: 2,
  initAnim: false,
  fraction: 0,
  defaultColors: ["rgba(183,61,129,1)","rgba(132,32,92,1)","rgba(197,128,177,1)","rgba(156,52,110,1)","rgba(56,167,123,1)","rgba(66,196,144,1)","rgba(68,204,192,1)","rgba(141,199,203,1)","rgba(78,206,155,1)"
  ,"rgba(177,107,160,1)","rgba(186,117,167,1)","rgba(58,174,163,1)","rgba(151,91,136,1)","rgba(143,25,91,1)","rgba(169,56,119,1)","rgba(144,97,134,1)"],

}

HEX.init = function(){

  if(HEX.initialized) return;
  HEX.initialized = true;

  HEX.canvas = document.getElementById("canvas"),
  HEX.ctx = HEX.canvas.getContext( '2d' );
  HEX.width = HEX.canvas.width;
  HEX.height = HEX.canvas.height;

  //setting the distance from the edge that internal points lay 
  HEX.constants.padded_distance = HEX.canvas.width/8;
  HEX.controller = 1;

  for(var i=0;i<HEX.constants.number_master_triangles;i++){
    HEX.triangle_master_array[i] = {vertices:[], static_triangles:[]};
  }

  HEX.createPoints();

};



HEX.createPoints = function(){

  var angle = 60*Math.PI/180;
  var l = (canvas.height/(2*Math.cos(angle)+1));

  for(var i=0;i<HEX.constants.number_master_triangles;i++){

    l = (canvas.height/(2*Math.cos(angle)+1));

    //setting hexagon outline
    HEX.triangle_master_array[i].vertices[0] = {x: 0.5*HEX.canvas.width, y: 0};
    HEX.triangle_master_array[i].vertices[1] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: l*Math.cos(angle) };
    HEX.triangle_master_array[i].vertices[2] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: l*Math.cos(angle)+l};
    HEX.triangle_master_array[i].vertices[3] = {x: 0.5*HEX.canvas.width, y: HEX.canvas.height};
    HEX.triangle_master_array[i].vertices[4] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: l*Math.cos(angle)+l};
    HEX.triangle_master_array[i].vertices[5] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: l*Math.cos(angle)};

    HEX.poly_points = [HEX.triangle_master_array[i].vertices[0],HEX.triangle_master_array[i].vertices[1],HEX.triangle_master_array[i].vertices[2],HEX.triangle_master_array[i].vertices[3],HEX.triangle_master_array[i].vertices[4],HEX.triangle_master_array[i].vertices[5]];


    //defining internal padded hexagon
    l = ((canvas.height - 2*HEX.constants.padded_distance)/(2*Math.cos(angle)+1));
    HEX.padded_points[0] = {x: 0.5*HEX.canvas.width, y: HEX.constants.padded_distance};
    HEX.padded_points[1] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle) };
    HEX.padded_points[2] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle)+l};
    HEX.padded_points[3] = {x: 0.5*HEX.canvas.width, y: HEX.canvas.height - HEX.constants.padded_distance};
    HEX.padded_points[4] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle)+l};
    HEX.padded_points[5] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle)};  

    var numPoints = 0;

    while(numPoints<HEX.constants.number_internal_points){

      curPoint = {x: 0, y: 0};
      while(!HEX.isPointInPoly(HEX.padded_points,curPoint)){
        curPoint = {x: 0.5*HEX.canvas.width-(HEX.canvas.width/2) + Math.floor(Math.random()*(HEX.canvas.width)), y: 0.5*HEX.canvas.height-(HEX.canvas.height/2) + Math.floor(Math.random()*(HEX.canvas.height))};
      }

      HEX.triangle_master_array[i].vertices[6+numPoints] = curPoint;
      numPoints++;

    }

    HEX.triangle_master_array[i].triangles = HEX.triangulate(HEX.triangle_master_array[i].vertices);

    for(var j=0;j<HEX.triangle_master_array[i].triangles.length;j++){

      HEX.triangle_master_array[i].triangles[j].color = HEX.constants.defaultColors[Math.floor(Math.random()*HEX.constants.defaultColors.length)];
      HEX.triangle_master_array[i].static_triangles[j] = {};
      HEX.triangle_master_array[i].triangles[j].pointTravelFrom_index = [];


    }
  }

};

HEX.createIndividualPoints = function(){

  var i=0;
  var angle = 60*Math.PI/180;
  var l = (canvas.height/(2*Math.cos(angle)+1));

  //clear object, create blank
  HEX.triangle_master_array[i] = {vertices:[], static_triangles:[]};

  //setting hexagon outline
  HEX.triangle_master_array[i].vertices[0] = {x: 0.5*HEX.canvas.width, y: 0};
  HEX.triangle_master_array[i].vertices[1] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: l*Math.cos(angle) };
  HEX.triangle_master_array[i].vertices[2] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: l*Math.cos(angle)+l};
  HEX.triangle_master_array[i].vertices[3] = {x: 0.5*HEX.canvas.width, y: HEX.canvas.height};
  HEX.triangle_master_array[i].vertices[4] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: l*Math.cos(angle)+l};
  HEX.triangle_master_array[i].vertices[5] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: l*Math.cos(angle)};

  l = ((canvas.height - 2*HEX.constants.padded_distance)/(2*Math.cos(angle)+1));
  HEX.padded_points[0] = {x: 0.5*HEX.canvas.width, y: HEX.constants.padded_distance};
  HEX.padded_points[1] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle) };
  HEX.padded_points[2] = {x: 0.5*HEX.canvas.width + l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle)+l};
  HEX.padded_points[3] = {x: 0.5*HEX.canvas.width, y: HEX.canvas.height - HEX.constants.padded_distance};
  HEX.padded_points[4] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle)+l};
  HEX.padded_points[5] = {x: 0.5*HEX.canvas.width - l*Math.sin(angle), y: HEX.constants.padded_distance+l*Math.cos(angle)};  


  var numPoints = 0;

  while(numPoints<HEX.constants.number_internal_points){

    curPoint = {x: 0, y: 0};
    while(!HEX.isPointInPoly(HEX.padded_points,curPoint)){
      curPoint = {x: 0.5*HEX.canvas.width-(HEX.canvas.width/2) + Math.floor(Math.random()*(HEX.canvas.width)), y: 0.5*HEX.canvas.height-(HEX.canvas.height/2) + Math.floor(Math.random()*(HEX.canvas.height))};
    }
    HEX.triangle_master_array[i].vertices[6+numPoints] = curPoint;
    numPoints++;
  
  }

  HEX.triangle_master_array[i].triangles = HEX.triangulate(HEX.triangle_master_array[i].vertices);

  for(var j=0;j<HEX.triangle_master_array[i].triangles.length;j++){

    HEX.triangle_master_array[i].triangles[j].color = HEX.constants.defaultColors[Math.floor(Math.random()*HEX.constants.defaultColors.length)];
    HEX.triangle_master_array[i].static_triangles[j] = {};
    HEX.triangle_master_array[i].triangles[j].pointTravelFrom_index = [];

  }

  HEX.update();

};

HEX.update = function() {

  if(HEX.controller) {
    HEX.updateGeometry();
    HEX.draw();
  }
};

//update the triangles being drawn
HEX.updateGeometry = function(){

  if(!HEX.initAnim){

    for(var j=0;j<HEX.triangle_master_array.length;j++){
      for(var i=0;i<HEX.triangle_master_array[j].triangles.length;i++){

        current_triangle = HEX.triangle_master_array[j].triangles[i];

        if(HEX.isPointInPoly(HEX.padded_points,current_triangle.a)){
          current_triangle.pointTravelFrom_index.push("a");// = "a";
        }

        else{
          current_triangle.pointTravelTo_index = "a";
        }

        if(HEX.isPointInPoly(HEX.padded_points,current_triangle.b)){
          current_triangle.pointTravelFrom_index.push("b");// = "b";
        }

        else{
          current_triangle.pointTravelTo_index = "b";
        }

        if(HEX.isPointInPoly(HEX.padded_points,current_triangle.c)){
          current_triangle.pointTravelFrom_index.push("c");// = "c";
        }

        else{
          current_triangle.pointTravelTo_index = "c";
        }

        //copy triangle into static triangle to prevent referencing so the triangles can slide open
        $.extend(true,HEX.triangle_master_array[j].static_triangles[i], current_triangle);

      }
    }

    HEX.constants.fraction = 0;
    HEX.initAnim = true;

  }

  else{

    var topLayer = 1;
    
    //this will 'flower' the top most one open
     if(HEX.constants.fraction<=1.0){
      
      for(var i=0;i<HEX.triangle_master_array[topLayer].triangles.length;i++){

        current_triangle = HEX.triangle_master_array[topLayer].static_triangles[i];

        for(var j=0;j<current_triangle.pointTravelFrom_index.length;j++){

          current_triangle[current_triangle.pointTravelFrom_index[j]].x = HEX.lerp(current_triangle[current_triangle.pointTravelFrom_index[j]].x,current_triangle[current_triangle.pointTravelTo_index].x,HEX.constants.fraction);
          current_triangle[current_triangle.pointTravelFrom_index[j]].y = HEX.lerp(current_triangle[current_triangle.pointTravelFrom_index[j]].y,current_triangle[current_triangle.pointTravelTo_index].y,HEX.constants.fraction);
        
        }
      
      }

      //change from linear -> exponential easing
      HEX.constants.fraction+=0.005;
    
    }


   

    //if current reveal is done reset animation, switch triangle layers, and repopulate layer below
    else{
      
      var topLayer = 1;

      //copy revealed lower layer to top layer
      $.extend(true,HEX.triangle_master_array[topLayer],HEX.triangle_master_array[0]);
      
      HEX.initAnim = false;
      HEX.createIndividualPoints();
    
    }
  }
};

HEX.lerp = function(a,b,f){
  return (1-f)*a + f*b;
}
  
HEX.draw = function(){

  HEX.ctx.clearRect(0,0,HEX.width,HEX.height);
  HEX = this;

  for(var i=0;i<HEX.triangle_master_array.length;i++){

    for(var j=0;j<HEX.triangle_master_array[i].triangles.length;j++){

      current_triangle = HEX.triangle_master_array[i].static_triangles[j];

      HEX.ctx.fillStyle   = current_triangle.color;
      HEX.ctx.strokeStyle =  current_triangle.color;
      HEX.ctx.lineWidth = 1;
      HEX.ctx.beginPath();
      HEX.ctx.moveTo(current_triangle.a.x, current_triangle.a.y);
      HEX.ctx.lineTo(current_triangle.b.x, current_triangle.b.y);
      HEX.ctx.lineTo(current_triangle.c.x, current_triangle.c.y);
      HEX.ctx.fill();
      HEX.ctx.stroke();
      HEX.ctx.closePath();

    }
  }
};


HEX.isPointInPoly = function(poly, pt){
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
  return c;
};

HEX.Triangle = function(a,b,c){


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
  
};

HEX.byX = function(a, b) {
  return b.x - a.x
};

HEX.map = function (value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};

//cleans up double edges
HEX.dedup = function(edges) {
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
};

HEX.triangulate = function(vertices) {
  //HEX = this;
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
};




