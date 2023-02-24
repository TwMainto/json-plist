import * as fs from "fs";
import {comm} from "../config/comm";

console.log('holle world');

export class main {

    static main() {
        let model_data = fs.readFileSync("./config/model.plist").toString().replace(/\s*/g, "");
        console.log("model_data", model_data);


        main.handle_main(model_data)
    }

    static handle_main(data: string) {
        let name = "test.png";
        let x = 300;
        let y = 300;
        // 替换文件名字
        data = data.replace(/%name%/g, name);
        // 替换文件大小
        data = data.replace('%x%', x.toString());
        data = data.replace('%y%', y.toString());
        console.log('data', data);
    }

    static handle_list() {

    }

    static readJson() {
        let data = fs.readFileSync("./test/Blur_Symbols.json").toString();
        let json_data = JSON.parse(data);
        // console.log('json ... ', json_data);
        // console.log('meta ... ', json_data.meta);
        // console.log('frames ... ', json_data.frames);
        for (let framesKey in json_data.frames) {
            console.log('framesKey', framesKey);
            this.create_model(frames, framesKey);
        }
        // this.create_model(json_data.frames);
    }

    static create_model(frames_data: any, framesKey: string) {
        let data = frames_data[framesKey];
        let name = "<key>`framesKey`</key><dict> %value% </dict>";
        for (let dataKey in data) {
            this.handle_keys(dataKey, data);
        }
    }

    static handle_keys(key: string, data: any) {
        let value = data[key];
        let ret_data = "";
        switch (key) {
            case "frame":
                ret_data += "<key>`key`</key><string>{{},{}}</string>";
                break;
            case "rotated":
                break;
            case "trimmed":
                break;
            case "spriteSourceSize":
                break;
            case "sourceSize":
                break;
            case "pivot":
                break;
        }
    }
}

main.readJson();

