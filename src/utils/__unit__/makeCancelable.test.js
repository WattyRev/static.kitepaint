import makeCancelable from "../makeCancelable";

describe("makeCancelable", () => {
  it("allows the promise to resolve", () => {
    expect.assertions(1);
    const request = makeCancelable(jest.fn().mockResolvedValue("boogers")());
    return request.promise.then(response => {
      expect(response).toEqual("boogers");
    });
  });
  it("allows the promise to reject", () => {
    expect.assertions(1);
    const request = makeCancelable(jest.fn().mockRejectedValue("boogers")());
    return request.promise.catch(response => {
      expect(response).toEqual("boogers");
    });
  });
  it("rejects the resolved promise with isCanceled when cancel is called", () => {
    expect.assertions(1);
    const request = makeCancelable(jest.fn().mockResolvedValue("boogers")());
    request.cancel();
    return request.promise.catch(response => {
      expect(response).toEqual({ isCanceled: true });
    });
  });
  it("rejects the rejected promise with isCanceled when cancel is called", () => {
    expect.assertions(1);
    const request = makeCancelable(jest.fn().mockRejectedValue("boogers")());
    request.cancel();
    return request.promise.catch(response => {
      expect(response).toEqual({ isCanceled: true });
    });
  });
});
