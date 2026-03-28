function parseFraction(value) {
    value = value.replace(/\s/g, "");

    if (value.includes("/")) {
        let [num, den] = value.split("/").map(Number);
        return num / den;
    }
    return Number(value);
}

function parseDivisor(input) {
    input = input.replace(/\s/g, "");

    if (input === "x") return { a: 1, b: 0 };
    if (input === "-x") return { a: -1, b: 0 };

    let match = input.match(/^([\-]?\d*)x([+\-]\d+)?$/);

    if (match) {
        let a = match[1];
        let b = match[2];

        if (a === "" || a === "+") a = 1;
        if (a === "-") a = -1;

        a = Number(a);
        b = b ? Number(b) : 0;

        return { a, b };
    }

    return { a: 1, b: -parseFraction(input) };
}

function syntheticDivision(coeffs, a, b) {
    let r = -b / a;
    let result = [coeffs[0]];

    for (let i = 1; i < coeffs.length; i++) {
        let next = coeffs[i] + result[i - 1] * r;
        result.push(next);
    }

    // 🔥 핵심: (ax+b) 보정
    let quotient = result.slice(0, -1).map(v => v / a);
    let remainder = result[result.length - 1];

    return { result, quotient, remainder, r };
}

function renderTable(coeffs, result, r) {
    let html = "<table class='table'><tr>";

    coeffs.forEach(v => html += `<td>${v}</td>`);
    html += "</tr><tr>";

    html += `<td></td>`;
    for (let i = 0; i < result.length - 1; i++) {
        html += `<td>${(result[i] * r).toFixed(3)}</td>`;
    }

    html += "</tr><tr>";

    result.forEach(v => html += `<td>${v.toFixed(3)}</td>`);

    html += "</tr></table>";

    return html;
}

function calculate() {
    let coeffs = document.getElementById("coeffs").value
        .split(",")
        .map(v => parseFraction(v));

    let divisorInput = document.getElementById("divisor").value;

    let { a, b } = parseDivisor(divisorInput);

    let { result, quotient, remainder, r } =
        syntheticDivision(coeffs, a, b);

    let table = renderTable(coeffs, result, r);

    let poly = quotient.map((c, i) => {
        let deg = quotient.length - i - 1;
        if (deg === 0) return c.toFixed(3);
        if (deg === 1) return `${c.toFixed(3)}x`;
        return `${c.toFixed(3)}x^${deg}`;
    }).join(" + ");

    document.getElementById("result").innerHTML = `
        ${table}
        <p>몫: ${poly}</p>
        <p>나머지: ${remainder.toFixed(3)}</p>
    `;
}