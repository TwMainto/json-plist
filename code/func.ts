import * as fs from "fs";

export default class func {

    size: { w: number, h: number } = {w: 0, h: 0};
    image: string = '';

    init(file_name: string) {
        let value = this.read_json(file_name);
        let model_data = fs.readFileSync("./config/model.plist").toString();
        model_data = model_data.replace(/%name%/g, this.image);
        // 替换文件大小
        model_data = model_data.replace('%x%', String(this.size.w));
        model_data = model_data.replace('%y%', String(this.size.h));
        model_data = model_data.replace("%key-value%", value);
        fs.writeFileSync(file_name + ".plist", model_data);
    }

    read_json(file_name: string): any {
        let json_data = JSON.parse(fs.readFileSync(file_name + ".json").toString());
        this.size = json_data.meta.size;
        this.image = json_data.meta.image;
        let value = "";
        for (let framesKey in json_data.frames) {
            value += this.create_model(json_data.frames, framesKey);
        }
        return value;
    }

    create_model(data: any, key: string): any {
        let frames_value = data[key];
        let name = "<key>" + key + "</key><dict> %value% </dict>";
        let lists_data = "";
        for (let dataKey in frames_value) {
            lists_data += this.create_list(dataKey, frames_value);
        }
        lists_data += "<key>offset</key><string>{0,0}</string>"
        return name.replace(/%value%/, lists_data);
    }

    create_list(data: any, key: string): any {
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