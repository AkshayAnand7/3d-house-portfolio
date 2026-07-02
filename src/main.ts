/**
 * main.ts — Entry point.
 *
 * Creates the Experience singleton. That's it.
 * All initialization flows from Experience.
 */

import { Experience } from '@core/Experience';
import './styles/global.css';

// Boot the engine
Experience.getInstance();
