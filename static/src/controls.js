const controls = `
<div class="plyr__controls">
<button type="button" class="plyr__control remote-only" aria-label="Play" data-plyr="play">
<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
<svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
<span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
<span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
</button>
<div class="plyr__progress__container">
<div class="plyr__progress">
<input class="remote-only" data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
<progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
<span role="tooltip" class="plyr__tooltip">00:00</span>
</div>
</div>
<button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
<svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
<span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
<span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
</button>
<div class="plyr__volume">
<input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
</div>
<div class="plyr__controls__item plyr__time--current plyr__time" aria-label="Current time"></div>
<button type="button" class="plyr__control" data-plyr="fullscreen">
<svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
<svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
<span class="label--pressed plyr__tooltip" role="tooltip">Exit fullscreen</span>
<span class="label--not-pressed plyr__tooltip" role="tooltip">Enter fullscreen</span>
</button>
</div>
`;

export default controls;
