var FishPathConfig = [
    {
        id: 1,
        path: [
            {
                positions: [0, 960, 0, 480, 0, 0],
                time: 5,
            },
            {
                positions: [0, 0, -540, 0, -540, 960],
                time: 5,
            }
        ]
    },
    {
        id: 2,
        path: [
            {
                positions: [0, 960, 0, 480, 0, 0],
                time: 5,
            },
            {
                positions: [0, 0, 540, 0, 540, 960],
                time: 5,
            }
        ]
    },
    {
        id: 3,
        path: [
            {
                positions: [540, 0, 0, 0, -540, 0],
                time: 5,
            },
            {
                positions: [-540, 0, 0, 0, 0, 960],
                time: 5,
            },
            {
                positions: [0, 960, 0, 0, 540, 0],
                time: 5,
            }
        ]
    },
    {
        id: 4,
        path: [
            {
                positions: [540, 300, 0, 0, -540, 300],
                time: 5,
            },
            {
                positions: [-540, 500, 0, 200, 540, 500],
                time: 5,
            },
            {
                positions: [540, 700, 0, 400, -540, 700],
                time: 5,
            }
        ]
    }
];


var FishToPathId = [
    1, 2, 3, 4, 1,
    1, 2, 3, 4, 1,
    1, 2, 3, 4, 1,
    1, 2, 3, 4, 1,
    2, 3, 4
];

module.exports = {
    getPath: function(fishId) {
        let pathId = FishToPathId[fishId];
        for (let key in FishPathConfig) {
            if (FishPathConfig[key].id == pathId) {
                return FishPathConfig[key].path;
            }
        }
    }
};