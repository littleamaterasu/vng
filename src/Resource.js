const res = {
    background_png: 'res/background.png',
    marios_way_mp3: 'res/marios_way.mp3',
    pipe_png: 'res/pipe.png',
    bird_png: 'res/bird.png',
    flappy_ttf: 'res/flappy.ttf',
    ground_png: 'res/ground.png',
    jump_wav: 'res/jump.mp3',
    hurt_wav: 'res/hurt.mp3',
    explosion_wav: 'res/explosion.mp3',
    score_mp3: 'res/score.mp3'
};

const g_mainmenu = [
    res.background_png
];

const g_maingame = [
    res.marios_way_mp3,
    res.pipe_png,
    res.bird_png,
    res.flappy_ttf,
    res.ground_png,
    res.hurt_wav,
    res.explosion_wav,
    res.jump_wav,
    res.score_mp3
];

const state = {
    FALLING: "FALLING",

}

const WINDOW_X = 1080;
const WINDOW_Y = 480;

const BASE_SPEED = 210;
const GRAVITY = -25;
const JUMP_STRENGTH = 6.5;
const MAX_UP_ANGLE = -45;
const MAX_DOWN_ANGLE = 90;
const TURN_RATE = 210;

const MAX_PIPES = 10;
const START_GAP = 720;
const HEIGHT_GAP = 140;
const MIDDLE_GAP = 20;

// cooldown các skill tính bằng ms
const COOLDOWN_SKILL_1 = 3;  // Dash
const COOLDOWN_SKILL_2 = 10; // Grow

const DASH_AMPLIFY = 5;
const DASH_DURATION = 150;


