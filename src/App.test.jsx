import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App.jsx";

afterEach(() => {
  vi.restoreAllMocks();
});

test("filters out wrong-genre tracks and drives the mixed autopilot queue", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});

  const fetchMock = vi.fn((url) => {
    const requestUrl = new URL(url);
    const term = requestUrl.searchParams.get("term");

    if (term === "Dio") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                trackId: "wrong-genre-1",
                trackName: "Pop Song Named Dio",
                artistName: "Unrelated Artist",
                collectionName: "Wrong Album",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/wrong-preview.mp3",
                primaryGenreName: "Pop",
              },
              {
                trackId: "metal-1",
                trackName: "Holy Diver",
                artistName: "Dio",
                collectionName: "Holy Diver",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/holy-diver.mp3",
                primaryGenreName: "Metal",
              },
              {
                trackId: "metal-noise-1",
                trackName: "Dio",
                artistName: "Some Metal Artist",
                collectionName: "Noise Album",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/dio-noise.mp3",
                primaryGenreName: "Metal",
              },
            ],
          }),
      });
    }

    if (term === "Black Sabbath") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                trackId: "metal-2",
                trackName: "Holy Diver",
                artistName: "Dio",
                collectionName: "The Very Beast",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/holy-diver-alt.mp3",
                primaryGenreName: "Metal",
              },
              {
                trackId: "metal-noise-2",
                trackName: "Black Sabbath",
                artistName: "Black Sabbath",
                collectionName: "Black Sabbath",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/black-sabbath.mp3",
                primaryGenreName: "Metal",
              },
            ],
          }),
      });
    }

    if (term === "country") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                trackId: "country-noise-1",
                trackName: "Country",
                artistName: "Noise Artist",
                collectionName: "Noise Album",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/country-noise.mp3",
                primaryGenreName: "Country",
              },
              {
                trackId: "country-1",
                trackName: "Country Song",
                artistName: "Country Artist",
                collectionName: "Country Album",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/country-song.mp3",
                primaryGenreName: "Country",
              },
            ],
          }),
      });
    }

    if (term === "video game soundtrack") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                trackId: "gaming-1",
                trackName: "Battle Theme",
                artistName: "Game Composer",
                collectionName: "Game OST",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/battle-theme.mp3",
                primaryGenreName: "Soundtrack",
              },
            ],
          }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [],
        }),
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  const { container, unmount } = render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/3 preview tracks/i)).toBeInTheDocument();
  });

  expect(screen.getByRole("heading", { name: "Holy Diver" })).toBeInTheDocument();
  expect(screen.queryByText("Pop Song Named Dio")).not.toBeInTheDocument();
  expect(screen.queryByText("Dio", { selector: "h2, strong" })).not.toBeInTheDocument();
  expect(screen.queryByText("Black Sabbath", { selector: "h2, strong" })).not.toBeInTheDocument();

  const queue = screen.getByRole("complementary");
  expect(within(queue).getByText("Holy Diver")).toBeInTheDocument();
  expect(within(queue).getByText("Battle Theme")).toBeInTheDocument();
  expect(within(queue).getByText("Country Song")).toBeInTheDocument();
  expect(within(queue).getByText("Gaming")).toBeInTheDocument();
  expect(within(queue).getByText("Country")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Battle Theme" })).toBeInTheDocument();
  });

  fireEvent(container.querySelector("audio"), new Event("ended"));

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "Country Song" })).toBeInTheDocument();
  });

  expect(screen.queryByText("Noise Artist")).not.toBeInTheDocument();

  document.activeElement?.blur?.();
  unmount();
  await Promise.resolve();
});
