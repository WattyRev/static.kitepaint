import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#getDesigns", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("makes the relevant request", async () => {
    expect.assertions(1);
    await Api.getDesigns().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/designs.php?filter%5Bactive%5D=1&filter%5Bstatus%5D=2&order%5B0%5D=id&order%5B1%5D=DESC&limit=50"
    );
  });
  it("adopts the provided filters", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      publicOnly: false,
      limit: 5
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/designs.php?filter%5Bactive%5D=1&order%5B0%5D=id&order%5B1%5D=DESC&limit=5"
    );
  });
  it("includes the user filter if provided", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      userId: "user-id"
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      expect.stringContaining("filter%5Buser%5D=user-id")
    );
  });
  it("excludes the limit if limit is set to null", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      limit: null
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      expect.not.stringContaining("limit")
    );
  });
  it("includes includeTotal in the request if provided", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      includeTotal: true
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      expect.stringContaining("includeTotal=1")
    );
  });
  it("does not include includeTotal by default", async () => {
    expect.assertions(1);
    await Api.getDesigns().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      expect.not.stringContaining("includeTotal")
    );
  });
  it("includes the manufacturers, products and name filters if provided", async () => {
    expect.assertions(3);
    await Api.getDesigns({
      manufacturers: ["m1", "m2"],
      products: ["p1"],
      name: "blue kite"
    }).catch(() => {});
    const url = Api.axiosInstance.get.mock.calls[0][0];
    expect(url).toEqual(
      expect.stringContaining("manufacturers%5B0%5D=m1&manufacturers%5B1%5D=m2")
    );
    expect(url).toEqual(expect.stringContaining("products%5B0%5D=p1"));
    expect(url).toEqual(expect.stringContaining("name=blue%20kite"));
  });
  it("excludes empty manufacturers, products and name filters", async () => {
    expect.assertions(3);
    await Api.getDesigns({
      manufacturers: [],
      products: [],
      name: ""
    }).catch(() => {});
    const url = Api.axiosInstance.get.mock.calls[0][0];
    expect(url).toEqual(expect.not.stringContaining("manufacturers"));
    expect(url).toEqual(expect.not.stringContaining("products"));
    expect(url).toEqual(expect.not.stringContaining("name"));
  });
  it("resolves with the designs and total when the response includes a total", async () => {
    expect.assertions(3);
    Api.axiosInstance.get.mockResolvedValue({
      data: {
        data: [
          {
            id: "123",
            variations: "[]"
          }
        ],
        total: 120
      }
    });
    const response = await Api.getDesigns({ includeTotal: true });
    expect(response.total).toEqual(120);
    expect(response.data).toHaveLength(1);
    expect(response.data[0].get("id")).toEqual("123");
  });
  it("does not make identical requests when they have been cached", async () => {
    expect.assertions(1);
    await Api.getDesigns().catch(() => {});
    await Api.getDesigns().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
  });
  it("does make identical requests when caching is disabled", async () => {
    expect.assertions(1);
    await Api.getDesigns({}, false).catch(() => {});
    await Api.getDesigns({}, false).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockRejectedValue();
    return Api.getDesigns().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with no data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({});
    return Api.getDesigns().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("resolves with the data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({
      data: [
        {
          id: "123",
          variations: "[]"
        }
      ]
    });
    return Api.getDesigns().then(response => {
      expect(response.data[0].get("json")).toEqual({
        created: null,
        id: "123",
        name: null,
        product: null,
        productStatus: null,
        status: null,
        updated: null,
        user: null,
        variations: []
      });
    });
  });

  describe("colors", () => {
    const requestedUrl = () => Api.axiosInstance.get.mock.calls[0][0];

    it("includes the colors with an any match by default", async () => {
      expect.assertions(3);
      await Api.getDesigns({ colors: ["#ff0000", "#00ff00"] }).catch(() => {});
      const url = requestedUrl();
      expect(url).toEqual(expect.stringContaining("colors%5B0%5D=%23ff0000"));
      expect(url).toEqual(expect.stringContaining("colors%5B1%5D=%2300ff00"));
      expect(url).toEqual(expect.stringContaining("colorsMatch=any"));
    });

    it("sends an all match when requested", async () => {
      expect.assertions(1);
      await Api.getDesigns({
        colors: ["#ff0000"],
        colorsMatch: "all"
      }).catch(() => {});
      expect(requestedUrl()).toEqual(
        expect.stringContaining("colorsMatch=all")
      );
    });

    it("falls back to any for an unknown match mode", async () => {
      expect.assertions(1);
      await Api.getDesigns({
        colors: ["#ff0000"],
        colorsMatch: "some"
      }).catch(() => {});
      expect(requestedUrl()).toEqual(
        expect.stringContaining("colorsMatch=any")
      );
    });

    it("sends colorsOnly only when it is set", async () => {
      expect.assertions(2);
      await Api.getDesigns({
        colors: ["#ff0000"],
        colorsOnly: true
      }).catch(() => {});
      expect(requestedUrl()).toEqual(expect.stringContaining("colorsOnly=1"));
      await Api.getDesigns({
        colors: ["#ff0000"],
        colorsOnly: false
      }).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[1][0]).toEqual(
        expect.not.stringContaining("colorsOnly")
      );
    });

    it("excludes the color params when no colors are selected", async () => {
      expect.assertions(3);
      await Api.getDesigns({
        colors: [],
        colorsMatch: "all",
        colorsOnly: true
      }).catch(() => {});
      const url = requestedUrl();
      expect(url).toEqual(expect.not.stringContaining("colors"));
      expect(url).toEqual(expect.not.stringContaining("colorsMatch"));
      expect(url).toEqual(expect.not.stringContaining("colorsOnly"));
    });
  });
});
