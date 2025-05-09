import { GitHubIcon } from "../../assets/icons/github";
import { TwitterIcon } from "../../assets/icons/twitter";
import { LinkedInIcon } from "../../assets/icons/linked-in";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 border-t-2 border-t-neutral-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-white">CopperMind</span>
            </div>
            <p className="mb-4">
              Inspired by the Copperminds of Scadrial — because thoughts are too
              precious to forget.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/devanshrai2003"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://github.com/Devanshrai2003"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/devanshrai2003/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-1 items-center">
                <EnvelopeIcon className="size-4 text-white" />
                <span>devanshrai2003@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-copper-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} CopperMind. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
