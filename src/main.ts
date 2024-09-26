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
const forwardBtn = document.getElementById('fwdBtn')!;
const backwardBtn = document.getElementById('bwdBtn')!;

let  toAdjustForward: boolean = true

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
    outputDisplay.innerHTML = '';
    const seconds = secondsInput.value;


    const lines = fileDisplayArea?.innerText.split("\n");
    lines?.forEach((line) => {
        outputDisplay?.append(`${adjustTimeLine(line, Number(seconds), toAdjustForward) || ""} \n`);
    })
    download.disabled = false;
});

forwardBtn.addEventListener('click',  () => {
    toAdjustForward = true;
    forwardBtn.classList.add('bg-[#a9a9a9]');
    backwardBtn.classList.remove('bg-[#a9a9a9]');
});

backwardBtn.addEventListener('click',  () => {
    toAdjustForward = false;
    backwardBtn.classList.add('bg-[#a9a9a9]');
    forwardBtn.classList.remove('bg-[#a9a9a9]');
});

