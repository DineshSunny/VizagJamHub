/* ==========================================================
   Vizag JamHub - Universal Transpose Engine
   Part 1 - Core Engine
========================================================== */

const NOTES = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#"
];

/* ==========================================================
   Musical keywords that should NEVER be transposed
========================================================== */

const RESERVED = new Set([
    "Riff",
    "Slide",
    "Fast",
    "fast",
    "Bass",
    "Keys",
    "Outro",
    "Intro",
    "Solo",
    "Break",
    "Bridge",
    "Verse",
    "Chorus",
    "Pre-Chorus",
    "Hook",
    "Ending",
    "Ending:",
    "Interlude",
    "X"
]);

/* ==========================================================
   Root + suffix
========================================================== */

function getRoot(chord){

    const m = chord.match(/^([A-G])(#?)/);

    return m ? m[0] : null;

}

function getSuffix(chord){

    const root = getRoot(chord);

    if(!root) return "";

    return chord.substring(root.length);

}

/* ==========================================================
   Is it a chord?
========================================================== */

function isChord(token){

    return /^[A-G](#)?/.test(token);

}

/* ==========================================================
   Shift root
========================================================== */

function shiftRoot(root, steps){

    const index = NOTES.indexOf(root);

    if(index === -1)
        return root;

    let newIndex = index + steps;

    while(newIndex < 0)
        newIndex += NOTES.length;

    newIndex %= NOTES.length;

    return NOTES[newIndex];

}

/* ==========================================================
   Basic chord
========================================================== */

function transposeChord(chord, steps){

    const root = getRoot(chord);

    if(!root)
        return chord;

    const suffix = getSuffix(chord);

    return shiftRoot(root, steps) + suffix;

}

/* ==========================================================
   Slash chords

   D/F#
========================================================== */

function transposeSlashChord(token, steps){

    return token
        .split("/")
        .map(part => transposeChord(part, steps))
        .join("/");

}

/* ==========================================================
   Hyphen chords

   A-Bm
   G-A
========================================================== */

function transposeHyphenChord(token, steps){

    return token
        .split("-")
        .map(part => transposeChord(part, steps))
        .join("-");

}

/* ==========================================================
   Parentheses

   (F# A)
========================================================== */

function transposeParentheses(token, steps){

    return token.replace(/\((.*?)\)/g, (_, inside)=>{

        return "(" +

            inside
            .split(/\s+/)
            .map(chord=>transposeChord(chord,steps))
            .join(" ")

            + ")";

    });

}

/* ==========================================================
   One token
========================================================== */

function transposeToken(token, steps){

    if(token === "")
        return token;

    if(RESERVED.has(token))
        return token;

    if(token === "X")
        return token;

    if(/^\d+$/.test(token))
        return token;

    if(token.startsWith("("))
        return transposeParentheses(token,steps);

    if(token.includes("/"))
        return transposeSlashChord(token,steps);

    if(token.includes("-"))
        return transposeHyphenChord(token,steps);

    if(isChord(token))
        return transposeChord(token,steps);

    return token;

}

/* ==========================================================
   One chord line
========================================================== */

function transposeLine(line, steps){

    return line
        .split(/\s+/)
        .map(token=>transposeToken(token,steps))
        .join(" ");

}

/* ===========================================
   Transpose Entire Song
=========================================== */

function transposeSong(chordText, originalKey, targetKey){

    const originalRoot = getRoot(originalKey);
    const targetRoot = getRoot(targetKey);

    const originalIndex = NOTES.indexOf(originalRoot);
    const targetIndex = NOTES.indexOf(targetRoot);

    if(originalIndex === -1 || targetIndex === -1){
        return chordText;
    }

    const steps = targetIndex - originalIndex;

    const lines = chordText.split("\n");

    const result = [];

    lines.forEach(line=>{

        // Empty line
        if(line.trim()===""){
            result.push(line);
            return;
        }

        // Headings
        if(line.startsWith("# ")){
            result.push(line);
            return;
        }

        // Lyrics
        if(line.startsWith("> ")){
            result.push(line);
            return;
        }

        // Chord line
        result.push(
            transposeLine(line,steps)
        );

    });

    return result.join("\n");

}

function buildTransposeDropdown(song){

    const select =
        document.getElementById("transposeSelect");

    if(!select)
        return;

    select.innerHTML = "";

    const root =
        getRoot(song.key);

    const suffix =
        getSuffix(song.key);

    NOTES.forEach(note=>{

        const option =
            document.createElement("option");

        option.value =
            note + suffix;

        option.textContent =
            note + suffix;

        if(note===root){

            option.textContent +=
                " (Org)";

            option.selected = true;

        }

        select.appendChild(option);

    });

}