"use client";

import { Metadata } from "next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Send, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with your orthopaedic instrument needs.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Call Us</h3>
              <div className="space-y-2">
                <a href="tel:+919324275387" className="block text-muted-foreground hover:text-primary transition-colors">
                  +91 9324275387
                </a>
                <a href="tel:+919987514573" className="block text-muted-foreground hover:text-primary transition-colors">
                  +91 9987514573
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Mon-Sat: 9:00 AM - 6:00 PM</p>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Us</h3>
              <a href="mailto:orthopoint.in@gmail.com" className="text-muted-foreground hover:text-primary transition-colors block">
                orthopoint.in@gmail.com
              </a>
              <p className="text-sm text-muted-foreground mt-3">We'll respond within 24 hours</p>
            </div>

            {/* Address Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Visit Us</h3>
              <p className="text-muted-foreground">
                4B/ Ghandhi Industrial Estate <br />
                Goddev Naka, Bhayander(East) 401105 .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    Sorry, there was an error sending your message. Please try again.
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Location</h2>
              <div className="rounded-xl overflow-hidden shadow-lg border border-border h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.559885706923!2d72.8559226!3d19.3048127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b18d5d54ce85%3A0xd2f640d9609247f1!2sORTHOPOINT!5e0!3m2!1sen!2sin!4v1735380000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="OrthoPoint Location"
                />
              </div>

              {/* Business Hours */}
              <div className="mt-6 bg-muted/30 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Business Hours</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-red-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Follow us on social media to stay updated with our latest products, offers, and industry insights.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.facebook.com/orthopoint"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary transition-all group"
            >
              <Facebook className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://www.twitter.com/orthopoint"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary transition-all group"
            >
              <Twitter className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/company/orthopoint"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary transition-all group"
            >
              <Linkedin className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/orthopoint"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary transition-all group"
            >
              <Instagram className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
