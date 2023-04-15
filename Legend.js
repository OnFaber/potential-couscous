function Legend(color, {
    tickSize = 6,
    width= 320 ,
    height= 50,
    marginRight= 10,
    marginLeft= 10,
    marginTop= 18,
    marginBottom = 16 + tickSize,
    ticks= width/64
} = {}){

    function ramp(color, n = 256) {
        const canvas = document.createElement("canvas");
        canvas.width = n;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

    let x;
    
    const svg = d3.create('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', [0, 0, width, height])
          .attr('id', 'color-legend')
          .style('display', 'block')
          .style('position', 'absolute');

    if (color.interpolator) {
        x = Object.assign(color.copy()
                          .interpolator(
                              d3.interpolateRound(marginLeft, width - marginRight)
                          ),
                          {range() { return [marginLeft, width - marginRight];}}
                         );

        svg.append('image')
            .attr('x', marginLeft)
            .attr('y', marginTop)
            .attr('width', width - marginLeft - marginRight)
            .attr('height', height - marginTop - marginBottom)
            .attr("preserveAspectRatio", 'none')
            .attr('xlink:href', ramp(color.interpolator()).toDataURL());
    }

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
              .tickSize(tickSize)
             )
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
              .attr("x", marginLeft)
              .attr("y", marginTop + marginBottom - height - 6)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .attr("class", "title")
             );
    return svg.node();
};

export function legend(color, {...options}){
    return Legend(color, options);
}

