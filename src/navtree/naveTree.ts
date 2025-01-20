export function sayHi(){

   // Access an HTML element by its class, ID, or tag name
   const childElement = document.querySelector('[data-path="CLUSTERS"]') as HTMLElement;
   const parentElement = childElement.closest('.tree-item.nav-folder') as HTMLElement;
   if (!parentElement) {
     console.log('Element not found')
     return;
    }
    console.log('Element fsound:', parentElement.childNodes);
    console.log(getNameText(parentElement.childNodes[0]))
}

function  getNameText(element:ChildNode):string | false{

  if(!(element as HTMLElement).classList.contains("tree-item-self")){
    return false;
  }
  const realElement = Array.from(element.childNodes).find((child: ChildNode) => { 
    if((child as HTMLElement).classList.contains("tree-item-inner")){
      return true;
    }
    return false;
   }) as HTMLElement;
   if(!realElement) return false
  const elementName :string = realElement.innerText
  return elementName
}