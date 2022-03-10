const conditionChaining = <T, V>(conditions: T[], values: V[]) => {
  const idx = conditions.findIndex((state) => Boolean(state));
  return idx > -1 ? values[idx] : values[values.length - 1];
};

export default conditionChaining;
