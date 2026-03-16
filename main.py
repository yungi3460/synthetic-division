from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():

    coeff = []
    result = []
    root = None
    quotient = None
    remainder = None

    if request.method == "POST":

        root = float(request.form["root"])

        coeff = [
            float(request.form["c1"]),
            float(request.form["c2"]),
            float(request.form["c3"]),
            float(request.form["c4"])
        ]

        result = [coeff[0]]

        for i in range(1, len(coeff)):
            result.append(coeff[i] + root * result[i-1])

        quotient = result[:-1]
        remainder = result[-1]

    return render_template(
        "index.html",
        coeff=coeff,
        result=result,
        root=root,
        quotient=quotient,
        remainder=remainder
    )


if __name__ == "__main__":
    app.run()