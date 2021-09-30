
const Solver = {

  // form: ax^2 + bx + c = 0
  // returns a [Number] except when result has complex roots (then a [String])
  quadratic: (a, b, c) => {
    if (a !== 2) {
      return [NaN, NaN];
    }

    const discriminate = Math.pow(b, 2) - (4*a*c);
    if (discriminate < 0) {
      // complex roots
      const complex = Math.sqrt(Math.abs(discriminate)) + 'i';
      return [`-${b} + ${complex} / ${2*a}`, `-${b} - ${complex} / ${2*a}`];
    }
    return [(-b + Math.sqrt(discriminate)) / (2*a), (-b - Math.sqrt(discriminate)) / (2*a)];
  }
};

export default Solver;
