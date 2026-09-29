"""Optional asset regeneration: Python + cairosvg and ffmpeg. Not needed to run the app."""
from pathlib import Path
import math, subprocess, tempfile
import cairosvg

root = Path(__file__).resolve().parents[1]
out = root / 'Frontend/public/media'
out.mkdir(parents=True, exist_ok=True)

def scene(t):
    x = 300 + 28 * math.sin(t * math.pi / 2)
    y = 227 + 4 * math.sin(t * math.pi)
    tilt = 3 * math.sin(t * math.pi / 2)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
<rect width="640" height="360" fill="#fbf7f0"/>
<circle cx="478" cy="88" r="43" fill="#f2dfba"/>
<path d="M80 92h86m-46-14h88M435 144h70" stroke="#e6dccd" stroke-width="8" stroke-linecap="round"/>
<path d="M0 248Q80 214 160 246T320 248T480 244T640 246V360H0Z" fill="#dfebea"/>
<path d="M0 284Q80 257 160 283T320 282T480 280T640 282V360H0Z" fill="#c7dddc"/>
<path d="M-25 328Q80 303 160 324T320 327T480 320T665 324" fill="none" stroke="#9dc4c5" stroke-width="2"/>
<ellipse cx="{x}" cy="{y+20}" rx="57" ry="7" fill="#123e50" opacity=".1"/>
<g transform="translate({x},{y}) rotate({tilt})">
<path d="M-50 0H50L31 23H-28Z" fill="#123e50"/>
<path d="M-39 3H38L29 9H-30Z" fill="#176c70"/>
<path d="M-4-97V0" stroke="#123e50" stroke-width="4" stroke-linecap="round"/>
<path d="M-11-90L-11-8H-61Z" fill="#fff" stroke="#d9e3e4" stroke-width="2"/>
<path d="M3-74L3-8H47Z" fill="#bd513c"/>
<path d="M-4-98L20-94L-4-84Z" fill="#d9af69"/>
</g>
<path d="M100 201C104 153 159 115 203 126S253 99 293 93S334 117 372 96" fill="none" stroke="#82979e" stroke-width="2" stroke-dasharray="4 8" stroke-linecap="round"/>
<g transform="translate(396,{83+3*math.sin(t*math.pi)})"><circle r="24" fill="white" stroke="#d9e3e4"/><text x="0" y="9" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="#b94532">?</text></g>
<g transform="translate(97,218)"><path d="M-32 22Q0-13 32 22Z" fill="#d9bd8e"/><path d="M-9 9L-7-38H7L9 9Z" fill="white" stroke="#d9e3e4"/><path d="M-7-38L0-48L7-38Z" fill="#b94532"/><rect x="-4" y="-31" width="8" height="7" rx="2" fill="#176c70"/></g>
<g fill="none" stroke="#176c70" stroke-width="2" stroke-linecap="round" opacity=".5"><path d="M185 298q10-5 20 0m180-26q10-5 20 0m94 32q10-5 20 0"/></g>
</svg>'''

with tempfile.TemporaryDirectory() as folder:
    folder = Path(folder)
    for frame in range(96):
        cairosvg.svg2png(bytestring=scene(frame/24).encode(), write_to=str(folder/f'{frame:03}.png'))
    cairosvg.svg2png(bytestring=scene(0).encode(), write_to=str(out/'lost-at-sea-poster.png'))
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','24','-i',str(folder/'%03d.png'),'-c:v','libx264','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(out/'lost-at-sea.mp4')],check=True)
print('Created original 4-second video and poster in', out)
