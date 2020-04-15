import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {NetworkGrapherService} from "./networkGrapher.service";
import {SrcCode, SrcElement} from "./networkGrapher.model";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'app-networkGrapher',
    styleUrls: ['./networkGrapher.component.scss'],
    templateUrl: './networkGrapher.component.html',
})
export class NetworkGrapherComponent implements OnInit, AfterContentInit {
    @ViewChild('chart') private chartContainer: ElementRef;

    srcElements = new SrcElement();

    public src;
    public margin: any = {top: 0, bottom: 0, left: 0, right: 0};
    public width: any;
    public height: any;
    public svg: any;
    // private nodes: any
    // private links: any
    public nodeElements: any;
    public textElements: any;
    public linkElements: any;
    public imgElements: any;
    public tooltipDiv: any;

    public nodes = [];
    public links = [];
    public element;

    constructor(private networkGrapherService: NetworkGrapherService) {
    }


    ngOnInit() {
    }

    ngAfterContentInit(): void {
        // this.createDiagram();
        const element = this.chartContainer.nativeElement;
        this.element = element;
        this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
        this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
        this.svg = d3.select(this.element).append('svg')
            .attr('width', this.element.offsetWidth)
            .style('border', "1px solid #00f9a6")
            .style('border-radius', "11px")
            .attr('height', this.element.offsetHeight);


        // this.svg.call(d3.zoom().on("zoom", function () {
        //     this.svg.attr("transform", d3.event.transform)
        // }))


        this.tooltipDiv = d3.select(this.element).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // this.context = this.svg.node().getContext("2d")

    }


    // public context;
    //  zoomed() {
    //
    //     this.context.save();
    //      this.context.clearRect(0, 0, width, height);
    //      this.context.translate(d3.event.transform.x, d3.event.transform.y);
    //      this.context.scale(d3.event.transform.k, d3.event.transform.k);
    //     this.drawPoints();
    //     this.context.restore();
    // }
    //  drawPoints() {
    //     this.context.beginPath();
    //     points.forEach(drawPoint);
    //     this.context.fill();
    // }


    public xAxis;
    public yAxis;
    public gX;
    public gY;
    public x;
    public y;
    public view;


    // zoomed(){
    //     this.svg.attr('transform', d3.event.transform);
    // }


    createDiagram() {


        let linkForce = d3
            .forceLink()
            .distance(200)
            .id(function (link) {
                return link.id
            })
            .strength(function (link) {
                return link.strength
            })

        var simulation = d3
            .forceSimulation()
            .force('link', linkForce)
            // .force('charge', d3.forceManyBody().strength(-120))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))


        let dragDrop = d3.drag().on('start', function (node) {
            node.fx = node.x
            node.fy = node.y
        }).on('drag', function (node) {
            simulation.alphaTarget(0.7).restart()
            node.fx = d3.event.x
            node.fy = d3.event.y
        }).on('end', function (node) {
            if (!d3.event.active) {
                simulation.alphaTarget(0)
            }
            node.fx = null
            node.fy = null
        })


        this.linkElements = this.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr('stroke', '#159499');
        // .attr("stroke", "rgba(50, 50, 50, 0.2)")


        this.textElements = this.svg.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(this.nodes)
            .enter().append("text")
            .text(function (node) {
                return node.label
            })
            .attr("font-size", 15)
            .attr('stroke', '#323537')
            .attr("dx", -20)
            .attr("dy", 40)

        this.imgElements = this.svg.append("g")
            .attr("class", "image")
            .selectAll("image")
            .data(this.nodes)
            .enter().append("image")
            // .attr("xlink:href", "https://i2.wp.com/www.inpimation.com/wp-content/uploads/2016/07/hmlgvvkj.png?w=362&ssl=1")
            .attr("xlink:href", function (d) {
                if (d.id == "ROOT") {
                    return "https://cdn2.iconfinder.com/data/icons/ballicons-2-free/100/wrench-512.png";
                } else if (d.kind == "FOR_STMT" || d.kind == "WHILE_STMT") {
                    return "https://tchol.org/images250_/exchange-png-9.png";
                } else if (d.kind == "IF_STMT") {
                    return "https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/crossroads-512.png";
                } else if (d.kind == "VAR_DECL") {
                    return "http://icons.iconarchive.com/icons/martz90/circle-addon1/256/text-plus-icon.png";
                } else if (d.kind == "CLASS_DECL" || d.kind == "FUNCTION_DECL") {
                    return "https://freeiconshop.com/wp-content/uploads/edd/settings-var-flat.png";
                } else {
                    return "https://icon-library.net/images/back-button-icon-png/back-button-icon-png-6.jpg";
                }
            })
            .attr("x", -30)
            .attr("y", -30)
            .attr("width", 20)
            .attr("height", 20);

        this.nodeElements = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.nodes)
            .enter().append("circle")
            .attr("r", 20)
            .attr("fill", 'transparent')
            .attr('stroke', '#939899')
            .attr("stroke-width", 1)
            .call(dragDrop)
            .on('click', (d) => this.selectNode(d))
            .on("mouseover", (d) => this.mouseOver(d))
            .on("mouseout", (d) => this.mouseOut(d));


        this.svg.call(d3.zoom().on('zoom', function(){
            d3.selectAll("g > *").attr('transform', d3.event.transform);
        }))

        simulation.nodes(this.nodes).on('tick', () => {
            this.nodeElements
                .attr('cx', function (node) {
                    return node.x
                })
                .attr('cy', function (node) {
                    return node.y
                });
            this.textElements
                .attr('x', function (node) {
                    return node.x
                })
                .attr('y', function (node) {
                    return node.y
                });
            this.imgElements
                .attr('x', function (node) {
                    return node.x - 10
                })
                .attr('y', function (node) {
                    return node.y - 10
                });
            this.linkElements
                .attr('x1', function (link) {
                    return link.source.x
                })
                .attr('y1', function (link) {
                    return link.source.y
                })
                .attr('x2', function (link) {
                    return link.target.x
                })
                .attr('y2', function (link) {
                    return link.target.y
                })
        })

        simulation.force("link").links(this.links)

    }

    // zoomed() {
    //
    // }

    mouseOver(data) {
        this.tooltipDiv.transition()
            .duration(200)
            .style("opacity", .9);
        this.tooltipDiv.html(
            "Name: " + data.id +
            "<br/>" +
            "Kind: " + data.kind +
            "<br/>" +
            "StartPoint To EndPoint: " + data.startPoint + " TO " + data.endPoint +
            "<br/>" +
            "Level: " + data.level
        )
            .style("height", "100px")
            .style("width", "200px")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }

    mouseOut(data) {
        this.tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
    }

    selectNode(selectedNode) {

        // let neighbors = this.returnNeighbors(selectedNode);
        //
        // // we modify the styles to highlight selected nodes
        // this.nodeElements.attr('fill', node => this.getNodeColor(node, neighbors));
        //
        // this.textElements.attr('fill', node => this.getTextColor(node, neighbors));
        //
        // this.linkElements.attr('stroke', node => this.getLinkColor(node, neighbors));


    }

    returnNeighbors(node): any {
        return this.links.reduce((neighbors, link) => {
                if (link.target.id === node.id) {
                    neighbors.push(link.source.id)
                } else if (link.source.id === node.id) {
                    neighbors.push(link.target.id)
                }
                return neighbors
            },
            [node.id]
        )
    }


    isNeighborLink(node, link) {
        return link.target.id === node.id || link.source.id === node.id
    }

    getNodeColor(node, neighbors) {
        // if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
        //     return node.level === 1 ? 'blue' : 'green'
        // }
        //
        // return node.level === 1 ? 'red' : 'gray'
    }

    getLinkColor(node, link) {
        return this.isNeighborLink(node, link) ? 'green' : '#E5E5E5'
    }

    getTextColor(node, neighbors) {
        return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
    }

    removeDiagram() {
        d3.selectAll("g > *").remove();
        this.nodes = [];
        this.links = [];
    }

    parsSrc() {
        if (this.src) {
            let srcCode = new SrcCode(this.src);
            this.networkGrapherService.parse(srcCode)
                .subscribe((res: HttpResponse<any>) => {
                    this.removeDiagram()
                    this.srcElements = JSON.parse(res.body);
                    this.createNodesLinks(this.srcElements);
                    this.createDiagram();
                }, (res: any) => this.onSaveError());
        }
    }

    onSaveError() {

    }

    createNodesLinks(node: SrcElement) {
        this.nodes.push({
            id: node.name,
            group: 0,
            label: node.name,
            level: node.level,
            startPoint: node.startPoint,
            endPoint: node.endPoint,
            kind: node.kind
        });

        node.foreignElements.forEach((element: SrcElement) => {
            this.links.push({
                target: element.name,
                source: node.name,
                strength: 0.7
            });
            this.createNodesLinks(element);
        });
        node.localElements.forEach((element: SrcElement) => {
            this.links.push({
                target: element.name,
                source: node.name,
                strength: 0.7
            });
            this.createNodesLinks(element);
        });
    }
}