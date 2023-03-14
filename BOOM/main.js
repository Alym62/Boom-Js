kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [
        0, 0, 0, 0
    ]
});

const MOVE_SPEED = 120;
const ENEMY_SPEED = 60;


loadSprite("bomberman", "./sprites/bomberman.png", {
    sliceX: 7,
    sliceY: 4,
    anims: {
        idleLeft: { from: 21, to: 21 },
        idleRight: { from: 7, to: 7 },
        idleUp: { from: 0, to: 0 },
        idleDown: { from: 14, to: 14 },

        moveLeft: { from: 22, to: 27 },
        moveRight: { from: 8, to: 13 },
        moveUp: { from: 1, to: 6 },
        moveDown: { from: 15, to: 20 },
    }
})

loadSprite("muro", "./sprites/muro.png")
loadSprite("brock", "./sprites/brock.png")
loadSprite("inimigo1", "./sprites/inimigo-1.png", { sliceX: 3 })
loadSprite("balao", "./sprites/inimigo-2.png", { sliceX: 3 })
loadSprite("bomba", "./sprites/bomba.png", {
    sliceX: 3,
    anims: {
        move: { from: 0, to: 2 },
    }
})
loadSprite("explosao", "./sprites/explosao.png", {
    sliceX: 5,
    sliceY: 5,
})
loadSprite("porta", "./sprites/porta.png");
loadSprite("bg", "./sprites/bg.png");
loadSprite("bg-2", "./sprites/bg-2.png");

scene('game', ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
        [
            'zzzzzzzzzzzzzzz',
            'zzazazazazazazz',
            'zaazzc   aaaaaz',
            'zzazazazazazaaz',
            'zaaaaaaazaazazz',
            'zzac   azazazaz',
            'zaaazaaai     z',
            'zzazazazazazazz',
            'z   aaaaazzaazz',
            'zzazazazazazazz',
            'zaaaaaazazc   z',
            'zzazazazazazazz',
            'zaaaaazazazzaaz',
            'zzazazazazazazz',
            'zaaaaaazzzzzzaz',
            'zzazai   aaaaaz',
            'zzaaaazzzzaapzz',
            'zzzzzzzzzzzzzzz',
        ]
    ]

    const cfg = {
        width: 26,
        height: 26,
        a: [sprite('muro'), 'wall', solid(), 'muro'],
        z: [sprite('brock'), 'brock', solid(), 'muro'],
        i: [sprite('inimigo1'), 'inimigo1', { dir: -1, time: 0 }, 'balon'],
        c: [sprite('balao'), 'balao', { dir: -1, time: 0 }, 'balon'],
        p: [sprite('porta'), 'porta'],
    }


    const gameLevel = addLevel(map[level], cfg);

    const scoreLabel = add([
        text('Score: ' + score),
        pos(650, 30),
        layer('ui'),
        {
            value: score,
        },
        scale(1),
        color(0, 0, 0)
    ])

    add([
        text('Level: ' + parseInt(level + 1)),
        pos(650, 60),
        scale(1),
        color(0, 0, 0)
    ])

    const bomb = add([
        sprite("bomberman", {
            animeSpeed: 0.1,
            frame: 14,
        }),
        pos(25, 190),
        { dir: vec2(1, 0) },
    ]);

    bomb.action(() => {
        bomb.pushOutAll()
    })



    keyDown('left', () => {
        bomb.move(-MOVE_SPEED, 0),
            bomb.dir = vec2(-1, 0);
    })

    keyDown('right', () => {
        bomb.move(MOVE_SPEED, 0),
            bomb.dir = vec2(1, 0);
    })

    keyDown('up', () => {
        bomb.move(0, -MOVE_SPEED),
            bomb.dir = vec2(0, -1);
    })

    keyDown('down', () => {
        bomb.move(0, MOVE_SPEED),
            bomb.dir = vec2(0, 1);
    })

    keyPress('left', () => {
        bomb.play('moveLeft')
    })

    keyPress('right', () => {
        bomb.play('moveRight')
    })

    keyPress('up', () => {
        bomb.play('moveUp')
    })

    keyPress('down', () => {
        bomb.play('moveDown')
    })

    keyPress('space', () => {
        spawBomber(bomb.pos.add(bomb.dir.scale(0)));
    })

    keyRelease('left', () => {
        bomb.play('idleLeft')
    })

    keyRelease('right', () => {
        bomb.play('idleRight')
    })

    keyRelease('up', () => {
        bomb.play('idleUp')
    })

    keyRelease('down', () => {
        bomb.play('idleDown')
    })

    //ACTION DOS INIMIGOS
    action('balao', (s) => {
        s.pushOutAll();
        s.move(s.dir * ENEMY_SPEED, 0)
        s.time -= dt();
        if (s.timer <= 0) {
            s.dir = s.dir
            s.time = rand(5)
        }
    })

    action('inimigo1', (s) => {
        s.pushOutAll();
        s.move(s.dir * ENEMY_SPEED, 0)
        s.time -= dt();
        if (s.timer <= 0) {
            s.dir = s.dir
            s.time = rand(5)
        }
    })


    //FUNÇÕES DA BOMBA
    function spawBomber(p) {
        const obj = add([sprite('bomba'), ('move'), pos(p), scale(1.5), 'bomber']);
        obj.pushOutAll();
        obj.play('move');

        wait(4, () => {
            destroy(obj);

            obj.dir = vec2(1, 0);
            spawKabum(obj.pos.add(obj.dir.scale(0)), 12) //centro

            obj.dir = vec2(0, -1);
            spawKabum(obj.pos.add(obj.dir.scale(20)), 2) //cima

            obj.dir = vec2(0, 1);
            spawKabum(obj.pos.add(obj.dir.scale(20)), 22) //baixo

            obj.dir = vec2(-1, 0);
            spawKabum(obj.pos.add(obj.dir.scale(20)), 10) //esquerda

            obj.dir = vec2(1, 0);
            spawKabum(obj.pos.add(obj.dir.scale(20)), 14) //direita
        })
    }

    function spawKabum(p, frame) {
        const obj = add([
            sprite('explosao', {
                animeSpeed: 0.1,
                frame: frame,
            }),
            pos(p),
            scale(1.5),
            'kabuum'
        ])

        obj.pushOutAll();
        wait(0.5, () => {
            destroy(obj);
        })

    }

    bomb.collides('porta', (d) => {
        go('game', {
            level: (level + 1) % map.length,
            score: scoreLabel.value
        })
    })

    collides('kabuum', 'balon', (k, s) => {
        camShake(4);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);

        scoreLabel.value++
        scoreLabel.text = 'score: ' + scoreLabel.value
    })

    collides('kabuum', 'wall', (k, s) => {
        camShake(4);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
    })

    collides('balon', 'muro', (s) => {
        s.dir = -s.dir
    })

    collides('kabuum', 'porta', (k, s) => {
        camShake(4);
        wait(1, () => {
            destroy(k)
        })

        destroy(s);

        gameLevel.spaw('p', s.gridPos.sub(0, 0))
    })

    bomb.collides('balon', () => {
        go('lose', {score: scoreLabel.value}, text('Você perdeu :('))
    })
})

scene('lose', ({ score }) => {
    add([text('Score: ' + score, 32),
    origin('center'),
    pos(400, 60)]),
      color(0, 0, 0)
})

go('game', { level: 0, score: 0 })

