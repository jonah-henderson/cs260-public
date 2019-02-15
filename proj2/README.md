# Date Raider

This is a bare-bones stock trading simulator built entirely on Vue and localStorage. Stock data comes from the IEX API. Clear your browser's localStorage to reset everything.

Prices/unrealised gains will update themselves every 60 seconds to avoid spamming the API, but if there's no price movement, this will not be noticeable.

## Known issues

The graphing library I used does a pretty good job at responsively resizing, but it can get confused with continuous window dragging. It works better if you only toggle browser responsive UI tools on 
and off.
