#!/bin/bash

# duplicate logos
sed -i -e '/<div className="logos animate-infinite-scroll">/r '<(sed -n '119,153p' app/page.tsx) app/page.tsx
