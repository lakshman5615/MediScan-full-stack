// export default function useCamera() {
//   const openCamera = () => {
//     alert("Camera open hoga (OCR yahan aayega)");
//   };

//   return { openCamera };
// }

export default function useCamera() {
const openCamera = async () => {
await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
alert("Camera opened (OCR integration next)");
};


return { openCamera };
}


