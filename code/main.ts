import * as fs from "fs";

console.log('holle world');

export class main {
    static size: { w: number, h: number } = {w: 0, h: 0};
    static image: string = '';

    static main(file_name: string) {
        let model_data = fs.readFileSync("./config/model.plist").toString();
        let value = this.readJson(file_name);
        model_data = model_data.replace(/%name%/g, this.image);
        // 替换文件大小
        console.log('aaa', this.size, this.image);
        model_data = model_data.replace('%x%', String(this.size.w));
        model_data = model_data.replace('%y%', String(this.size.h));
        model_data = model_data.replace("%key-value%", value);
        console.log('model_data', model_data);
        fs.writeFileSync(file_name + ".plist", model_data);
    }

    static readJson(file_name: string): any {
        let json_data = JSON.parse(fs.readFileSync(file_name + ".json").toString());
        this.size = json_data.meta.size;
        this.image = json_data.meta.image;
        let value = "";
        for (let framesKey in json_data.frames) {
            value += this.create_model(json_data.frames, framesKey);
        }
        return value;
    }

    static create_model(frames_data: any, framesKey: string): any {
        let data = frames_data[framesKey];
        let name = "<key>" + framesKey + "</key><dict> %value% </dict>";
        let lists_data = "";
        for (let dataKey in data) {
            lists_data += this.handle_keys(dataKey, data);
        }
        lists_data += "<key>offset</key><string>{0,0}</string>"
        return name.replace(/%value%/, lists_data);
    }

    static handle_keys(key: string, data: any): any {
        let value = data[key];
        let ret_data = "";
        switch (key) {
            case "frame":
                ret_data +=
                    `<key>${key}</key><string>{{${value.x},${value.y}},{${value.w},${value.h}}}</string>`;
                break;
            case "rotated":
                ret_data += `<key>${key}</key>`
                if (value) {
                    ret_data += "<true/>";
                } else {
                    ret_data += "<false/>";
                }
                break;
            case "spriteSourceSize":
                ret_data +=
                    `<key>sourceColorRect</key><string>{{0,0},{${value.w},${value.h}}}</string>`;
                break;
            case "sourceSize":
                ret_data +=
                    `<key>${key}</key><string>{${value.w},${value.h}}</string>`;
                break;
        }

        return ret_data;
    }
}

main.main("./test/Blur_Symbols");