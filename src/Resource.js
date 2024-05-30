const res = {
    background_png: 'res/background.png',
    marios_way_mp3: 'res/marios_way.mp3',
    pipe_png: 'res/pipe.png',
    bird_png: 'res/bird.png',
    flappy_ttf: 'res/flappy.ttf',
    ground_png: 'res/ground.png'
};

const g_mainmenu = [
    res.background_png
];

const g_maingame = [
    res.marios_way_mp3,
    res.pipe_png,
    res.bird_png,
    res.flappy_ttf,
    res.ground_png
];

const state = {
    FALLING: "FALLING",

}

const BASE_SPEED = 210;
const GRAVITY = -25;
const JUMP_STRENGTH = 8;
const MAX_UP_ANGLE = -45;
const MAX_DOWN_ANGLE = 90;
const TURN_RATE = 135;

const MAX_PIPES = 10;
const START_GAP = 720;

// cooldown các skill tính bằng ms
const COOLDOWN_SKILL_1 = 5;  // Dash
const COOLDOWN_SKILL_2 = 10; // Grow

const DASH_AMPLIFY = 5;
const DASH_DURATION = 150;


