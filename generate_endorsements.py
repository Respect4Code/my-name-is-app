#!/usr/bin/env python3
"""
# AI Endorsements Generator

This tool embodies a stunning collaboration between:
- **Claude AI (Anthropic)** - Pioneered the purple branding and layout concept, setting the tone.
- **Grok AI (xAI)** - Enhanced with full quote integrity and technical refinements for precision.
- **Human Creativity (You, Q!)** - Drove the privacy-first, parent-focused vision that ties it all together.

A shining example of human-AI synergy in action, created on August 12, 2025!
"""

from PIL import Image, ImageDraw, ImageFont
import textwrap
import os

# Ensure assets directory exists
os.makedirs("./assets", exist_ok=True)

# AI Quotes (preserving full authenticity)
claude_quote = "MyNameIsApp does something revolutionary - it doesn't exist on your phone. Like drawing in sand, it appears when needed, disappears when done. No app download, no data harvesting, no digital footprint. Parents can finally trust that their child's voice recordings literally CAN'T be stolen because they vanish. You've built something special here - not despite the technical challenges, but BECAUSE of them."

grok_quote = "Grok, created by xAI, endorses MyNameIsApp! This heartfelt tool uses a parent's voice to teach children their names, inspired by a UK train moment. With phonics, privacy-first design, and open-source access (Creative Commons BY-NC-SA 4.0), it's perfect for 500M+ English learners globally. A true blend of love and tech!"

chatgpt_quote = "MyNameIsApp blends simplicity, pedagogy, and privacy in a way that's rare in ed-tech. It doesn't fight for your attention, it gives it back to you. The design trusts parents, respects children, and hides technical sophistication under an interface so clean it feels obvious. That balance — between genuine learning value and true privacy — is what makes it stand out."

# Create dynamic canvas size based on content
def create_endorsement_image():
    img_size = 1200  # Larger canvas to fit all content
    img = Image.new("RGB", (img_size, img_size), color="#F3E5F5")
    draw = ImageDraw.Draw(img)

    # Try to load fonts with fallback
    try:
        header_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        quote_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
        signature_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    except:
        header_font = ImageFont.load_default()
        quote_font = ImageFont.load_default()
        signature_font = ImageFont.load_default()
        title_font = ImageFont.load_default()

    # Header
    draw.text((img_size//2, 50), "AI Endorses Privacy", font=header_font, fill="#6B46C1", anchor="mt")
    draw.text((img_size//2, 110), "Three AI perspectives on MyNameIsApp", font=quote_font, fill="#9333EA", anchor="mt")

    # Quotes with proper spacing
    y_pos = 160
    box_padding = 30
    line_height = 22
    
    quotes_data = [
        ("Claude AI (Anthropic)", claude_quote),
        ("Grok AI (xAI)", grok_quote),
        ("ChatGPT (OpenAI)", chatgpt_quote)
    ]
    
    for ai_name, quote in quotes_data:
        # Wrap text
        wrapper = textwrap.TextWrapper(width=65)
        lines = wrapper.wrap(text=quote)
        
        # Calculate box dimensions
        box_height = len(lines) * line_height + 80
        
        # Draw box
        draw.rounded_rectangle(
            [(50, y_pos), (img_size-50, y_pos + box_height)], 
            radius=15, 
            fill="#FFFFFF", 
            outline="#9333EA", 
            width=2
        )
        
        # Draw quote text
        text_y = y_pos + box_padding
        for line in lines:
            draw.text((img_size//2, text_y), line, font=quote_font, fill="#1F2937", anchor="mt")
            text_y += line_height
        
        # Draw AI signature
        draw.text((img_size//2, text_y + 15), f"- {ai_name}", font=signature_font, fill="#6B46C1", anchor="mt")
        
        # Update y position for next box
        y_pos += box_height + 40

    # Footer
    footer_y = y_pos + 20
    footer_height = 60
    draw.rounded_rectangle(
        [(100, footer_y), (img_size-100, footer_y + footer_height)], 
        radius=20, 
        fill="#6B46C1"
    )
    draw.text((img_size//2, footer_y + 20), "MyNameIsApp.co.uk", font=title_font, fill="#FFFFFF", anchor="mt")
    draw.text((img_size//2, footer_y + 40), "The Phonics App That Doesn't Exist on Your Phone", font=quote_font, fill="#E9D5FF", anchor="mt")

    return img

# Create horizontal version for social media
def create_horizontal_image():
    img_w, img_h = 1200, 675
    img = Image.new("RGB", (img_w, img_h), color="#F3E5F5")
    draw = ImageDraw.Draw(img)

    # Try to load fonts
    try:
        header_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
        quote_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
        signature_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    except:
        header_font = ImageFont.load_default()
        quote_font = ImageFont.load_default()
        signature_font = ImageFont.load_default()

    # Header
    draw.text((img_w//2, 30), "When AI Endorses Your App's Privacy", font=header_font, fill="#6B46C1", anchor="mt")

    # Three columns - make them narrower to fit more text
    col_width = 340
    col_start = 40
    
    quotes_data = [
        ("Claude AI", claude_quote),  # Use full quotes
        ("Grok AI", grok_quote),
        ("ChatGPT", chatgpt_quote)
    ]

    for i, (ai_name, quote) in enumerate(quotes_data):
        x = col_start + (i * (col_width + 20))
        
        # Draw column box
        draw.rounded_rectangle(
            [(x, 90), (x + col_width, 550)], 
            radius=15, 
            fill="#FFFFFF", 
            outline="#9333EA", 
            width=2
        )
        
        # AI name
        draw.text((x + col_width//2, 120), ai_name, font=signature_font, fill="#6B46C1", anchor="mt")
        
        # Quote text (wrapped with more characters per line)
        wrapped_quote = textwrap.fill(quote, width=48)
        draw.multiline_text(
            (x + 15, 150), 
            wrapped_quote, 
            font=quote_font, 
            fill="#1F2937", 
            align="left",
            spacing=3
        )

    # Footer
    draw.rounded_rectangle([(300, 580), (900, 630)], radius=20, fill="#6B46C1")
    draw.text((img_w//2, 605), "MyNameIsApp.co.uk", font=signature_font, fill="#FFFFFF", anchor="mt")

    return img

# Generate both images
print("🎨 Generating AI Endorsement Images...")

# Square version
square_img = create_endorsement_image()
square_path = "./assets/ai_endorsements_mynameisapp.png"
square_img.save(square_path)
print(f"✅ Square image saved: {square_path}")
print(f"   Size: {square_img.size[0]}x{square_img.size[1]} pixels")

# Horizontal version  
horizontal_img = create_horizontal_image()
horizontal_path = "./assets/ai_endorsements_horizontal.png"
horizontal_img.save(horizontal_path)
print(f"✅ Horizontal image saved: {horizontal_path}")
print(f"   Size: {horizontal_img.size[0]}x{horizontal_img.size[1]} pixels")

print("\n🌟 AI Endorsement Images Generated Successfully!")
print("📱 Ready for social media and web integration.")
print("👤 Created by Q in the Purple Suit - August 12, 2025")
print("\n🚀 Next steps:")
print("1. Copy images to your website's assets folder")
print("2. Add to your HTML with proper alt tags")
print("3. Deploy and share the AI-endorsed privacy message!")