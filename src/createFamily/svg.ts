//@ts-ignore
export default function svgElements(){
    
    return{
        son:function(){
            // 1 - Container Element
            const con = document.createElement('div');
            con.classList.add("inputMsgCon","son");

            // 2 - SVG Element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "48");
            svg.setAttribute("height", "48");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "currentColor");
            svg.setAttribute("stroke-width", "1.25");
            svg.setAttribute("stroke-linecap", "round");
            svg.setAttribute("stroke-linejoin", "round");
            svg.classList.add("lucide", "lucide-baby", "svg","lorens");

            // Path 1
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "M9 12h.01");
            svg.appendChild(path1);

            // Path 2
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", "M15 12h.01");
            svg.appendChild(path2);

            // Path 3
            const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path3.setAttribute("d", "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5");
            svg.appendChild(path3);

            // Path 4
            const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path4.setAttribute("d", "M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1");
            svg.appendChild(path4);

            // Append SVG to the container
            con.appendChild(svg);

            // 3 - Text Element
            const text = document.createElement('div');
            text.innerText = "Create Son";
            text.classList.add("textMsg");

            // Append Text element to the container
            con.appendChild(text);

            return con;
        },
        brother:function(){
           // 1 - Container Element
            const con = document.createElement('div');
            con.classList.add("inputMsgCon","brother");

            // 2 - SVG Element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "48");
            svg.setAttribute("height", "48");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "currentColor");
            svg.setAttribute("stroke-width", "1");
            svg.setAttribute("stroke-linecap", "round");
            svg.setAttribute("stroke-linejoin", "round");
            svg.classList.add("lucide", "lucide-git-compare", "svg");

            // Circle 1
            const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle1.setAttribute("cx", "18");
            circle1.setAttribute("cy", "18");
            circle1.setAttribute("r", "3");
            svg.appendChild(circle1);

            // Circle 2
            const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle2.setAttribute("cx", "6");
            circle2.setAttribute("cy", "6");
            circle2.setAttribute("r", "3");
            svg.appendChild(circle2);

            // Path 1
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "M13 6h3a2 2 0 0 1 2 2v7");
            svg.appendChild(path1);

            // Path 2
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", "M11 18H8a2 2 0 0 1-2-2V9");
            svg.appendChild(path2);

            // Append SVG to the container
            con.appendChild(svg);

            // 3 - Text Element
            const text = document.createElement('div');
            text.innerText = "Create Brother";
            text.classList.add("textMsg");

            // Append Text element to the container
            con.appendChild(text);

            return con;
        },
        cluster:function(){
            // 1 - Container Element
            const con = document.createElement('div');
            con.classList.add("inputMsgCon","cluster");

            // 2 - SVG Element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("viewBox", "0 0 16 16");
            svg.setAttribute("class", "clusterSvg");
            svg.setAttribute("version", "1.1");

            // G Elements
            const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g1.setAttribute("id", "SVGRepo_bgCarrier");
            g1.setAttribute("stroke-width", "0");

            const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g2.setAttribute("id", "SVGRepo_tracerCarrier");
            g2.setAttribute("stroke-linecap", "round");
            g2.setAttribute("stroke-linejoin", "round");

            const g3 = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g3.setAttribute("id", "SVGRepo_iconCarrier");

            // Path 1
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "M14 12c-0.372 0.011-0.716 0.121-1.008 0.305l-2.212-2.155c0.434-0.547 0.708-1.239 0.74-1.993l1.57-0.157c0.225 0.556 0.76 0.941 1.385 0.941 0.823 0 1.49-0.667 1.49-1.49s-0.667-1.49-1.49-1.49c-0.749 0-1.368 0.552-1.474 1.271l-1.591 0.128c-0.224-1.136-0.973-2.060-1.978-2.521l0.308-0.839h0.26c1.099-0.008 1.986-0.9 1.986-2 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.742 0.404 1.39 1.004 1.735l-0.27 0.855c-0.227-0.054-0.487-0.084-0.754-0.084-0.83 0-1.59 0.296-2.181 0.789l-2.994-3.004c0.141-0.224 0.225-0.497 0.225-0.79 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 0.823 0.663 1.492 1.484 1.5 0.281-0.001 0.544-0.079 0.767-0.214l2.993 3.004c-0.474 0.588-0.76 1.344-0.76 2.168 0 0.015 0 0.030 0 0.045-0 0.058-0 0.108-0 0.158l-0.66 0.11c-0.313-0.72-1.019-1.214-1.839-1.214-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2 0-0.020-0-0.039-0.001-0.059l0.63-0.097c0.242 0.843 0.768 1.538 1.466 1.992l-0.556 1.188c-0.161-0.049-0.347-0.078-0.539-0.080-0.006-0-0.012-0-0.017-0-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2 0-0.64-0.301-1.211-0.769-1.577l0.566-1.153c0.364 0.146 0.787 0.231 1.229 0.231 0.847 0 1.621-0.311 2.216-0.824l2.176 2.124c-0.25 0.33-0.4 0.748-0.4 1.2 0 1.105 0.895 2 2 2s2-0.895 2-2c0-1.105-0.895-2-2-2 0 0 0 0 0 0zM5 15c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1zM8 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5z");

            // Append elements
            g3.appendChild(path1);
            svg.appendChild(g1);
            svg.appendChild(g2);
            svg.appendChild(g3);

            // Append SVG to the container
            con.appendChild(svg);

            // 3 - Text Element
            const text = document.createElement('div');
            text.innerText = "Create Cluster";
            text.classList.add("textMsg");

            // Append Text element to the container
            con.appendChild(text);

            return con;
        },
        delete:function(){
                // 1 - Container Element
            const con = document.createElement('div');
            con.classList.add("inputMsgCon","delete");

            // 2 - SVG Element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "currentColor");
            svg.setAttribute("stroke-width", "2");
            svg.setAttribute("stroke-linecap", "round");
            svg.setAttribute("stroke-linejoin", "round");
            svg.classList.add("lucide", "lucide-trash-2");

            // Path 1
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "M3 6h18");
            svg.appendChild(path1);

            // Path 2
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6");
            svg.appendChild(path2);

            // Path 3
            const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path3.setAttribute("d", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2");
            svg.appendChild(path3);

            // Line 1
            const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line1.setAttribute("x1", "10");
            line1.setAttribute("x2", "10");
            line1.setAttribute("y1", "11");
            line1.setAttribute("y2", "17");
            svg.appendChild(line1);

            // Line 2
            const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line2.setAttribute("x1", "14");
            line2.setAttribute("x2", "14");
            line2.setAttribute("y1", "11");
            line2.setAttribute("y2", "17");
            svg.appendChild(line2);

            // Append SVG to the container
            con.appendChild(svg);

            // 3 - Text Element
            const text = document.createElement('div');
            text.innerText = "Delete Note";
            text.classList.add("textMsg");

            // Append Text element to the container
            con.appendChild(text);

            return con;
        },
        noThing: function () {
            // 1 - Container Element
            const con = document.createElement('div');
            con.classList.add("inputMsgCon","noThing");
        
            // 2 - SVG Element
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "currentColor");
            svg.setAttribute("stroke-width", "2");
            svg.setAttribute("stroke-linecap", "round");
            svg.setAttribute("stroke-linejoin", "round");
            svg.classList.add("lucide", "lucide-x-circle");
        
            // Circle
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", "12");
            circle.setAttribute("cy", "12");
            circle.setAttribute("r", "10");
            svg.appendChild(circle);
        
            // Path 1
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", "m15 9-6 6");
            svg.appendChild(path1);
        
            // Path 2
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path2.setAttribute("d", "m9 9 6 6");
            svg.appendChild(path2);
        
            // Append SVG to the container
            con.appendChild(svg);
        
            return con;
        },
    }
}

