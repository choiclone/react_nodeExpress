export const busStationType = {
    "1": "공항",
    "2": "마을",
    "3": "간선",
    "4": "지선",
    "5": "순환",
    "6": "광역",
    "7": "인천",
    "8": "경기",
    "9": "폐지",
    "0": "공용"
};

export const stationType = {
    0: "공용 버스",
    1: "일반형 시내/ 농어촌버스",
    2: "좌석형 시내 / 농어촌버스",
    3: "직행좌석형 시내 / 농어촌버스",
    4: "일반형 시외버스",
    5: "좌석형 시외버스",
    6: "고속형 시외버스",
    7: "마을버스"
};

export const routeType = {
    1: "공항",
    2: "마을",
    3: "간선",
    4: "지선",
    5: "순환",
    6: "광역",
    7: "인천",
    8: "경기",
    9: "폐지",
    0: "공용"
};

export const StationTime = (seconds) => {
    let hour = parseInt(seconds / 3600);
    let min = parseInt((seconds / 60) % 60);
    if (hour === 0) return min === 0 ? "" : min + "분";
    else return hour + "시간" + min + "분"
};

export const BusPosition = (arrmsg) => {
    return arrmsg.split("[")[1] === undefined ? arrmsg.split("[")[0] + "]" : arrmsg.split("[")[1]
};

const patternNumber = /[0-9]/
const patternAlphabet = /[a-zA-Z]/
const patternHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
const orderLevelDesc = [patternNumber, patternAlphabet, patternHangul]

const getLevel = (s) => {
    const index = orderLevelDesc.findIndex((pattern) => pattern.test(s))
    return index;
}

export const sortGroupString = (source) => {
    source.sort((a, b) => {
        const aLevel = getLevel(a.rtNm["_text"].charAt(0))
        const bLevel = getLevel(b.rtNm["_text"].charAt(0))
        console.log(aLevel, bLevel)
        // if (aLevel === bLevel) {
        //     return a.charCodeAt(0) - b.charCodeAt(0)
        // }
        // return bLevel - aLevel; // 오름 차순 정렬 
    });
}