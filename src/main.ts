import { adjustTimeLine } from "./adjuster";
import "./style.css";

const fileInput = document.getElementById('fileInput');
const fileDisplayArea = document.getElementById('fileDisplayArea');
const outputDisplay = document.getElementById('outputDisplay')!;
const adjustmentForm = document.getElementById('adjustmentForm');
const download = document.getElementById("download")! as HTMLButtonElement;
// const minutesInput: HTMLInputElement = document.getElementById('minutes')! as HTMLInputElement;
const secondsInput: HTMLInputElement = document.getElementById('seconds')! as HTMLInputElement;
const displaySection = document.getElementById('displaySection')!;


fileInput?.addEventListener('change', function (e) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    outputDisplay.innerText = "";
    if (!file) return;

    // const textType = /text.*/;
    const nameRegex = /[a-zA-Z0-9._-]+.srt/

    if (file.name.match(nameRegex)) {
        var reader = new FileReader();

        reader.onload = function (e) {
            if (fileDisplayArea) {
                fileDisplayArea.innerText = reader.result?.toString() || "";
                displaySection.style.display = 'block'
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

    const data = outputDisplay.innerText;
    const lines = data.split('\n');
    let newData = "";
    lines.forEach((line) => newData += `${line.trim()}\n`);
    newData += '\n\n';

    link.setAttribute('download', "export.srt");
    link.setAttribute('href', 'data:' + 'text/plain'  +  ';charset=utf-16,' + newData);
    link.click(); 
})

adjustmentForm?.addEventListener('submit', (ev: SubmitEvent) => {
    ev.preventDefault();
    // const minutes = minutesInput.value;
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
    lines?.forEach((line) => {
        outputDisplay?.append(`${adjustTimeLine(line, Number(seconds), false) || ""} \n`);
        // setTimeout(() => {
        //     // console.log(`|${adjustTimeLine(line, Number(seconds), false)}|`)
        //     outputDisplay?.append(`${adjustTimeLine(line, Number(seconds), false) || ""} \n`);
        // }, (1 * index))
    })
    download.disabled = false;
});



