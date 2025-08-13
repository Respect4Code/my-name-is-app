#!/usr/bin/env python3
"""
Combined Screenshot Graphic Generator
Creates the exact layout Claude suggested with tweets and visual connection
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_combined_screenshot():
    # Create canvas - taller to accommodate both tweets
    width, height = 1200, 1600
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)
    
    # Purple gradient colors matching MyNameIsApp branding
    purple_dark = "#7B2CBF"
    purple_light = "#C77DFF"
    
    # Top banner - "HISTORIC CONFIRMATION"
    header_height = 100
    for y in range(header_height):
        ratio = y / header_height
        r = int(123 + (199 - 123) * ratio)
        g = int(44 + (125 - 44) * ratio)
        b = int(191 + (255 - 191) * ratio)
        color = f"#{r:02x}{g:02x}{b:02x}"
        draw.rectangle([(0, y), (width, y+1)], fill=color)
    
    # Load fonts
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
        tweet_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        username_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except:
        title_font = ImageFont.load_default()
        tweet_font = ImageFont.load_default()
        username_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Header text
    draw.text((width//2, 50), "HISTORIC CONFIRMATION", font=title_font, 
              fill='white', anchor='mm')
    
    # Main content area starts
    content_y = 140
    margin = 60
    tweet_width = width - (margin * 2)
    
    # Q's Tweet Box (Perfect Storm)
    tweet_box_height = 450
    draw.rectangle([(margin, content_y), (width - margin, content_y + tweet_box_height)], 
                   fill='#F8F9FA', outline='#E1E8ED', width=2)
    
    # Q's profile info
    profile_y = content_y + 20
    draw.text((margin + 20, profile_y), "Q ✓ @q_clubb • 11s", font=username_font, fill='#1DA1F2')
    
    # Q's tweet text
    tweet_text_y = profile_y + 40
    q_tweet = '"Is this the first time multiple AI systems have publicly\nendorsed the same product on the same day government\nprivacy laws changed?"'
    draw.text((margin + 20, tweet_text_y), q_tweet, font=tweet_font, fill='#14171A')
    
    # Perfect Storm graphic representation (simplified)
    storm_y = tweet_text_y + 100
    storm_box_height = 280
    draw.rectangle([(margin + 40, storm_y), (width - margin - 40, storm_y + storm_box_height)], 
                   fill='#4A90E2', outline='#357ABD', width=2)
    
    # Perfect Storm title
    draw.text((width//2, storm_y + 30), "A PERFECT STORM FOR", font=username_font, fill='white', anchor='mm')
    draw.text((width//2, storm_y + 60), "CHILDREN'S PRIVACY INNOVATION", font=username_font, fill='white', anchor='mm')
    
    # Timeline points
    timeline_y = storm_y + 100
    draw.text((width//2, timeline_y), "Aug 12", font=tweet_font, fill='white', anchor='mm')
    
    # Three timeline points
    point1_x = margin + 120
    point2_x = width // 2
    point3_x = width - margin - 120
    
    # Timeline line
    draw.line([(point1_x, timeline_y + 40), (point3_x, timeline_y + 40)], fill='white', width=3)
    
    # Timeline circles
    for x in [point1_x, point2_x, point3_x]:
        draw.ellipse([(x-8, timeline_y + 32), (x+8, timeline_y + 48)], fill='white')
    
    # Timeline labels
    draw.text((point1_x, timeline_y + 70), "UK child privacy", font=small_font, fill='white', anchor='mm')
    draw.text((point1_x, timeline_y + 90), "laws took effect—", font=small_font, fill='white', anchor='mm')
    draw.text((point1_x, timeline_y + 110), "we already complied.", font=small_font, fill='white', anchor='mm')
    
    draw.text((point2_x, timeline_y + 70), "xAI launched", font=small_font, fill='white', anchor='mm')
    draw.text((point2_x, timeline_y + 90), "Voice Mode—", font=small_font, fill='white', anchor='mm')
    draw.text((point2_x, timeline_y + 110), "we use parent voices", font=small_font, fill='white', anchor='mm')
    
    draw.text((point3_x, timeline_y + 70), "4 AI systems from", font=small_font, fill='white', anchor='mm')
    draw.text((point3_x, timeline_y + 90), "3 companies", font=small_font, fill='white', anchor='mm')
    draw.text((point3_x, timeline_y + 110), "praised our approach", font=small_font, fill='white', anchor='mm')
    
    # Bottom of Q's tweet
    draw.text((margin + 20, storm_y + storm_box_height + 30), "MyNameIsApp.co.uk", font=tweet_font, fill='#1DA1F2')
    draw.text((width - margin - 20, storm_y + storm_box_height + 30), "#PrivacyFirst", font=tweet_font, fill='#1DA1F2', anchor='rm')
    
    # Visual arrow/connection
    arrow_y = content_y + tweet_box_height + 20
    arrow_center_x = width // 2
    
    # Draw arrow pointing down
    draw.polygon([(arrow_center_x, arrow_y), 
                  (arrow_center_x - 15, arrow_y - 20), 
                  (arrow_center_x + 15, arrow_y - 20)], 
                 fill=purple_dark)
    draw.line([(arrow_center_x, arrow_y - 30), (arrow_center_x, arrow_y - 10)], 
              fill=purple_dark, width=4)
    
    # Grok's Reply Box
    grok_y = arrow_y + 40
    grok_box_height = 200
    
    draw.rectangle([(margin, grok_y), (width - margin, grok_y + grok_box_height)], 
                   fill='#F8F9FA', outline='#E1E8ED', width=2)
    
    # Grok's profile info
    grok_profile_y = grok_y + 20
    draw.text((margin + 20, grok_profile_y), "Grok ✓ @grok • 2m", font=username_font, fill='#1DA1F2')
    draw.text((margin + 20, grok_profile_y + 25), "Replying to @q_clubb @AnthropicAI and 10 others", font=small_font, fill='#657786')
    
    # Grok's tweet text
    grok_text_y = grok_profile_y + 60
    grok_tweet1 = "Based on research, no major UK child privacy laws changed on Aug 12,"
    grok_tweet2 = "2025, though Online Safety Act enforcement advanced recently."
    grok_tweet3 = "Multi-AI public endorsements of a product seem"
    grok_tweet4 = "unprecedented—kudos on pioneering this for kids' privacy! 🚀"
    
    draw.text((margin + 20, grok_text_y), grok_tweet1, font=tweet_font, fill='#14171A')
    draw.text((margin + 20, grok_text_y + 25), grok_tweet2, font=tweet_font, fill='#14171A')
    
    # Highlight the key phrase
    draw.text((margin + 20, grok_text_y + 60), grok_tweet3, font=tweet_font, fill='#14171A')
    # Make "unprecedented" bold/highlighted
    draw.text((margin + 20, grok_text_y + 85), grok_tweet4, font=username_font, fill=purple_dark)
    
    # Engagement stats
    stats_y = grok_text_y + 120
    draw.text((margin + 20, stats_y), "♡ 1", font=small_font, fill='#657786')
    draw.text((margin + 80, stats_y), "📊 2", font=small_font, fill='#657786')
    
    # Bottom banner
    footer_y = height - 120
    footer_height = 120
    
    for y in range(footer_y, height):
        ratio = (y - footer_y) / footer_height
        r = int(199 - (199 - 123) * ratio)
        g = int(125 - (125 - 44) * ratio)
        b = int(255 - (255 - 191) * ratio)
        color = f"#{r:02x}{g:02x}{b:02x}"
        draw.rectangle([(0, y), (width, y+1)], fill=color)
    
    # Footer text
    draw.text((width//2, footer_y + 30), "First Multi-AI Public Endorsement - Confirmed Unprecedented", 
              font=username_font, fill='white', anchor='mm')
    draw.text((width//2, footer_y + 60), "MyNameIsApp.co.uk | August 12, 2025", 
              font=tweet_font, fill='white', anchor='mm')
    
    return img

def main():
    print("Creating combined screenshot graphic...")
    
    img = create_combined_screenshot()
    
    # Save the image
    output_path = "historic_confirmation_combined.png"
    img.save(output_path, 'PNG', quality=95, optimize=True)
    
    print(f"✅ Combined screenshot graphic saved as: {output_path}")
    print(f"📏 Dimensions: {img.size[0]}x{img.size[1]} pixels")
    print("🎯 Perfect for quote tweets and press kit")
    print("\n💜 Layout matches Claude's suggestions:")
    print("   - Purple top banner: HISTORIC CONFIRMATION")
    print("   - Q's Perfect Storm tweet with infographic")
    print("   - Visual arrow connection")
    print("   - Grok's unprecedented confirmation")
    print("   - Purple bottom banner with key message")
    print("\n🚀 Ready for social media and media outreach!")

if __name__ == "__main__":
    main()