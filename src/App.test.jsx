import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App.jsx";

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders the player and loads API tracks", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                trackId: 1,
                trackName: "API Song",
                artistName: "API Artist",
                collectionName: "API Album",
                artworkUrl100: "https://example.com/100x100.jpg",
                previewUrl: "https://example.com/preview.mp3",
              },
            ],
          }),
      })
    )
  );

  render(<App />);

  expect(
    screen.getByRole("heading", { name: /music player/i })
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/library ready with/i)).toBeInTheDocument();
  });

  expect(screen.getByText("API Song")).toBeInTheDocument();
});
