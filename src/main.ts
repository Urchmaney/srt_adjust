import { adjustTimeLine } from "./adjuster";
import "./style.css";

const fileInput = document.getElementById('fileInput');
const fileDisplayArea = document.getElementById('fileDisplayArea');
const outputDisplay = document.getElementById('outputDisplay')!;
const adjustmentForm = document.getElementById('adjustmentForm');
const download = document.getElementById("download")!;
const minutesInput: HTMLInputElement = document.getElementById('minutes')! as HTMLInputElement;
const secondsInput: HTMLInputElement = document.getElementById('seconds')! as HTMLInputElement;

let gFile: File;

fileInput?.addEventListener('change', function (e) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    outputDisplay.innerText = "";
    if (!file) return;

    const textType = /text.*/;
    const nameRegex = /[a-zA-Z0-9._-]+.srt/

    console.log(file.type.match(textType), "=======", file.type)
    if (file.name.match(nameRegex)) {
        gFile = file;
        var reader = new FileReader();

        reader.onload = function (e) {
            if (fileDisplayArea) {
                fileDisplayArea.innerText = reader.result?.toString() || "";
            }

        }

        reader.readAsText(file);
    } else {
        if (fileDisplayArea) fileDisplayArea.innerText = "File not supported!"
    }
});

download.addEventListener("click", function(e) {
    const link = document.body.appendChild(
        document.createElement("a")
    );

    link.setAttribute('download', "export.srt");
    link.setAttribute('href', 'data:' + 'text/plain'  +  ';charset=utf-8,' + encodeURIComponent(outputDisplay.innerText));
    link.click(); 
})

adjustmentForm?.addEventListener('submit', (ev: SubmitEvent) => {
    ev.preventDefault();
    const minutes = minutesInput.value;
    const seconds = secondsInput.value;

    // if (!gFile) return;
    // console.log(gFile)

    // const reader = new FileReader();
    // reader.onprogress = function(e) {
    //     if (outputDisplay) {
    //         console.log(reader.result?.toString() || "");
    //         outputDisplay.innerText = reader.result?.toString() || "";
    //         // outputDisplay.append(reader.result?.toString() || "")
    //     }
    // }

    // reader.readAsText(gFile)

    const lines = fileDisplayArea?.innerText.split("\n");
    lines?.forEach((line, index) => {
        setTimeout(() => {
            
            outputDisplay?.append(`${adjustTimeLine(line, Number(seconds), true) || ""} \n`);
        }, (1 * index))
    })
});



