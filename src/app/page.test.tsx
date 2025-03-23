/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mock the next/image component since it's not available in test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />
  },
}));

// Mock next/link to use a regular anchor tag
jest.mock('next/link', () => ({
  __esModule: true,
  default: function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  },
}));

describe("Landing Page", () => {
  it("renders the main heading", async () => {
    render(await Page());
    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Write your daily and read them in exciting way");
  });

  it("renders login and signup links", async () => {
    render(await Page());
    const loginLink = screen.getByRole("link", { name: /log in/i });
    const signupLink = screen.getByRole("link", { name: /sign up/i });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/signup");
  });

  it("renders the background image", async () => {
    render(await Page());
    const image = screen.getByAltText("back slash");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/back-splash.png");
  });
});