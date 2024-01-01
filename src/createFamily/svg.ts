// @ts-ignore
export default svgElements  = function (){
    
    const sonSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-baby svg"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>'
    const brotherSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-compare svg"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/></svg>'
    const clusterSvg = '<svg viewBox="0 0 16 16" class="clusterSvg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier"  stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path  d="M14 12c-0.372 0.011-0.716 0.121-1.008 0.305l-2.212-2.155c0.434-0.547 0.708-1.239 0.74-1.993l1.57-0.157c0.225 0.556 0.76 0.941 1.385 0.941 0.823 0 1.49-0.667 1.49-1.49s-0.667-1.49-1.49-1.49c-0.749 0-1.368 0.552-1.474 1.271l-1.591 0.128c-0.224-1.136-0.973-2.060-1.978-2.521l0.308-0.839h0.26c1.099-0.008 1.986-0.9 1.986-2 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.742 0.404 1.39 1.004 1.735l-0.27 0.855c-0.227-0.054-0.487-0.084-0.754-0.084-0.83 0-1.59 0.296-2.181 0.789l-2.994-3.004c0.141-0.224 0.225-0.497 0.225-0.79 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 0.823 0.663 1.492 1.484 1.5 0.281-0.001 0.544-0.079 0.767-0.214l2.993 3.004c-0.474 0.588-0.76 1.344-0.76 2.168 0 0.015 0 0.030 0 0.045-0 0.058-0 0.108-0 0.158l-0.66 0.11c-0.313-0.72-1.019-1.214-1.839-1.214-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2 0-0.020-0-0.039-0.001-0.059l0.63-0.097c0.242 0.843 0.768 1.538 1.466 1.992l-0.556 1.188c-0.161-0.049-0.347-0.078-0.539-0.080-0.006-0-0.012-0-0.017-0-1.105 0-2 0.895-2 2s0.895 2 2 2c1.105 0 2-0.895 2-2 0-0.64-0.301-1.211-0.769-1.577l0.566-1.153c0.364 0.146 0.787 0.231 1.229 0.231 0.847 0 1.621-0.311 2.216-0.824l2.176 2.124c-0.25 0.33-0.4 0.748-0.4 1.2 0 1.105 0.895 2 2 2s2-0.895 2-2c0-1.105-0.895-2-2-2 0 0 0 0 0 0zM5 15c-0.552 0-1-0.448-1-1s0.448-1 1-1c0.552 0 1 0.448 1 1s-0.448 1-1 1zM8 10.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5z"></path> </g></svg>'
    const deleteSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>'
    const noThingSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'


    return{
        son:function(){
            const con = document.createElement('div');
            con.addClass("inputMsgCon")

            //1-svg element 
            const div = document.createElement('div');
            // Set the innerHTML to the SVG string
            div.innerHTML = sonSvg
            // Get the SVG element from the div
            const svg = div.firstChild;
            

            //2-text Element
            const text = document.createElement('div');
            text.innerText = "Create Son"
            text.addClass("textMsg")
            //append svg , text elements to con 
            con.appendChild(svg)
            con.appendChild(text)
            return con
        },
        brother:function(){
            const con = document.createElement('div');
            con.addClasses(["inputMsgCon", "brother"])

            //1-svg element 
            const div = document.createElement('div');
            // Set the innerHTML to the SVG string
            div.innerHTML = brotherSvg
            // Get the SVG element from the div
            const svg = div.firstChild;
            

            //2-text Element
            const text = document.createElement('div');
            text.innerText = "Create Brother"
            text.addClass("textMsg")
            //append svg , text elements to con 
            con.appendChild(svg)
            con.appendChild(text)
            return con
        },
        cluster:function(){
            const con = document.createElement('div');
            con.addClasses(["inputMsgCon", "cluster"])

            //1-svg element 
            const div = document.createElement('div');
            // Set the innerHTML to the SVG string
            div.innerHTML = clusterSvg
            // Get the SVG element from the div
            const svg = div.firstChild;
            

            //2-text Element
            const text = document.createElement('div');
            text.innerText = "Create Cluster"
            text.addClass("textMsg")
            //append svg , text elements to con 
            con.appendChild(svg)
            con.appendChild(text)
            return con
        },
        delete:function(){
            const con = document.createElement('div');
            con.addClasses(["inputMsgCon", "delete"])

            //1-svg element 
            const div = document.createElement('div');
            // Set the innerHTML to the SVG string
            div.innerHTML = deleteSvg
            // Get the SVG element from the div
            const svg = div.firstChild;
            

            //2-text Element
            const text = document.createElement('div');
            text.innerText = "Delete Note"
            text.addClass("textMsg")
            //append svg , text elements to con 
            con.appendChild(svg)
            con.appendChild(text)
            return con
        },
        noThing:function(){
            const con = document.createElement('div');
            con.addClasses(["inputMsgCon", "noThing"])

            //1-svg element 
            const div = document.createElement('div');
            // Set the innerHTML to the SVG string
            div.innerHTML = noThingSvg
            // Get the SVG element from the div
            const svg = div.firstChild;
          
            //append svg , text elements to con 
            con.appendChild(svg)
            
            return con
        }
    }
}

