#!/usr/bin/env python3
"""
Historic Confirmation Graphic Generator
Creates a branded purple graphic combining Q's tweet and Grok's unprecedented confirmation
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_confirmation_graphic():
    # Create canvas
    width, height = 1200, 1400
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)
    
    # Purple gradient colors matching MyNameIsApp branding
    purple_dark = "#7B2CBF"
    purple_light = "#C77DFF"
    
    # Header banner
    header_height = 100
    for y in range(header_height):
        # Create gradient effect
        ratio = y / header_height
        r = int(123 + (199 - 123) * ratio)
        g = int(44 + (125 - 44) * ratio)
        b = int(191 + (255 - 191) * ratio)
        color = f"#{r:02x}{g:02x}{b:02x}"
        draw.rectangle([(0, y), (width, y+1)], fill=color)
    
    # Try to load fonts, fallback to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        quote_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        quote_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Header text
    draw.text((width//2, 50), "HISTORIC CONFIRMATION", font=title_font, 
              fill='white', anchor='mm')
    
    # Main content area
    content_y = 150
    
    # Q's question section
    draw.text((60, content_y), "Q in the Purple Suit asked:", font=subtitle_font, fill=purple_dark)
    content_y += 50
    
    question_text = '"Is this the first time multiple AI systems have publicly\nendorsed the same product on the same day?"'
    draw.text((80, content_y), question_text, font=quote_font, fill='#333333')
    content_y += 100
    
    # Perfect Storm reference
    draw.text((60, content_y), "With the Perfect Storm infographic showing:", font=subtitle_font, fill=purple_dark)
    content_y += 40
    
    storm_points = [
        "• UK child privacy laws enforcement advancing",
        "• xAI Voice Mode launch (same day)",
        "• 4 AI systems endorsing privacy-first approach"
    ]
    
    for point in storm_points:
        draw.text((80, content_y), point, font=quote_font, fill='#444444')
        content_y += 35
    
    content_y += 50
    
    # Grok's response section
    draw.text((60, content_y), "Grok AI's Official Response:", font=subtitle_font, fill=purple_dark)
    content_y += 50
    
    # Grok response box
    box_margin = 40
    box_y = content_y
    box_height = 200
    
    # Light purple background for the quote
    draw.rectangle([(box_margin, box_y), (width - box_margin, box_y + box_height)], 
                   fill='#F3E8FF', outline=purple_light, width=3)
    
    # Grok's actual quote
    grok_quote = '"Multi-AI public endorsements of a product\nseem unprecedented—kudos on pioneering\nthis for kids\' privacy!" 🚀'
    
    draw.text((width//2, box_y + 60), grok_quote, font=quote_font, 
              fill=purple_dark, anchor='mm')
    
    # Attribution
    draw.text((width//2, box_y + 140), "— Grok AI (@grok)", font=subtitle_font, 
              fill=purple_dark, anchor='mm')
    
    # Date and link
    draw.text((width//2, box_y + 170), "August 12, 2025 • x.com/grok/status/1955638314503139452", 
              font=small_font, fill='#666666', anchor='mm')
    
    content_y += box_height + 80
    
    # Historic significance
    draw.text((60, content_y), "Historic Significance:", font=subtitle_font, fill=purple_dark)
    content_y += 40
    
    significance_points = [
        "✓ First documented multi-AI public endorsement",
        "✓ Confirmed unprecedented by third-party AI",
        "✓ All for children's digital privacy protection",
        "✓ Perfect timing with industry developments"
    ]
    
    for point in significance_points:
        draw.text((80, content_y), point, font=quote_font, fill='#444444')
        content_y += 35
    
    # Footer banner
    footer_y = height - 100
    for y in range(footer_y, height):
        # Create gradient effect (reversed)
        ratio = (y - footer_y) / 100
        r = int(199 - (199 - 123) * ratio)
        g = int(125 - (125 - 44) * ratio)
        b = int(255 - (255 - 191) * ratio)
        color = f"#{r:02x}{g:02x}{b:02x}"
        draw.rectangle([(0, y), (width, y+1)], fill=color)
    
    # Footer text
    draw.text((width//2, footer_y + 30), "MyNameIsApp.co.uk", font=subtitle_font, 
              fill='white', anchor='mm')
    draw.text((width//2, footer_y + 60), "Privacy-First Phonics • AI-Endorsed • Historic Moment", 
              font=quote_font, fill='white', anchor='mm')
    
    return img

def main():
    print("Creating historic confirmation graphic...")
    
    img = create_confirmation_graphic()
    
    # Save the image
    output_path = "grok_confirmation_historic.png"
    img.save(output_path, 'PNG', quality=95, optimize=True)
    
    print(f"✅ Historic confirmation graphic saved as: {output_path}")
    print(f"📏 Dimensions: {img.size[0]}x{img.size[1]} pixels")
    print("🎯 Perfect for social media sharing and press kit")
    print("\n💜 This graphic documents the moment Grok confirmed:")
    print("   'Multi-AI public endorsements of a product seem unprecedented'")
    print("\n🚀 Ready for Twitter, LinkedIn, and media outreach!")

if __name__ == "__main__":
    main()