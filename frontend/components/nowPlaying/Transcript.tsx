import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  Flex,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { LuBookCopy } from "react-icons/lu";
import PodcastHelper from "../../helpers/PodcastHelper";
import { usePlayer } from '../../utilities/PlayerContext';

interface TranscriptProps {
  episodeId: string;
}

const dummyTranscript = [
  {
      "start": 0.149,
      "end": 7.795,
      "text": " One of the questions I get asked on pretty much every live stream I do is, what do you think about the new Dune film you useless drunk in our soul?",
      "words": [
          {
              "word": "One",
              "start": 0.149,
              "end": 0.249,
              "score": 0.904,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 0.269,
              "end": 0.329,
              "score": 0.699,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 0.369,
              "end": 0.449,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "questions",
              "start": 0.489,
              "end": 0.99,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 1.05,
              "end": 1.13,
              "score": 0.764,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 1.15,
              "end": 1.27,
              "score": 0.944,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "asked",
              "start": 1.37,
              "end": 1.57,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 1.65,
              "end": 1.73,
              "score": 0.982,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 1.81,
              "end": 2.091,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 2.131,
              "end": 2.331,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "every",
              "start": 2.411,
              "end": 2.651,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "live",
              "start": 2.711,
              "end": 2.971,
              "score": 0.771,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stream",
              "start": 2.991,
              "end": 3.252,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 3.292,
              "end": 3.372,
              "score": 0.782,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "do",
              "start": 3.392,
              "end": 3.612,
              "score": 0.73,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is,",
              "start": 3.732,
              "end": 3.852,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "what",
              "start": 4.052,
              "end": 4.192,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "do",
              "start": 4.212,
              "end": 4.292,
              "score": 0.941,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 4.312,
              "end": 4.412,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 4.453,
              "end": 4.653,
              "score": 0.969,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 4.713,
              "end": 4.933,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 4.953,
              "end": 5.033,
              "score": 0.775,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "new",
              "start": 5.073,
              "end": 5.233,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Dune",
              "start": 5.273,
              "end": 5.573,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "film",
              "start": 5.633,
              "end": 5.914,
              "score": 0.894,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 5.974,
              "end": 6.174,
              "score": 0.811,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "useless",
              "start": 6.314,
              "end": 6.694,
              "score": 0.778,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "drunk",
              "start": 6.794,
              "end": 7.095,
              "score": 0.891,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 7.135,
              "end": 7.215,
              "score": 0.47,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "our",
              "start": 7.295,
              "end": 7.435,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "soul?",
              "start": 7.495,
              "end": 7.795,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 0,
      "seek": 0.149,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 8.095,
      "end": 13.98,
      "text": "Also, when are you gonna pay me the money you owe, or am I gonna have to send Jamal around to break your fucking legs?",
      "words": [
          {
              "word": "Also,",
              "start": 8.095,
              "end": 8.416,
              "score": 0.945,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "when",
              "start": 8.576,
              "end": 8.696,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "are",
              "start": 8.716,
              "end": 8.796,
              "score": 0.83,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 8.816,
              "end": 8.876,
              "score": 0.993,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gonna",
              "start": 8.896,
              "end": 9.096,
              "score": 0.304,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pay",
              "start": 9.136,
              "end": 9.316,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "me",
              "start": 9.356,
              "end": 9.456,
              "score": 0.706,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 9.497,
              "end": 9.577,
              "score": 0.83,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "money",
              "start": 9.637,
              "end": 9.857,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 9.897,
              "end": 10.057,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "owe,",
              "start": 10.177,
              "end": 10.317,
              "score": 0.78,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "or",
              "start": 10.497,
              "end": 10.597,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "am",
              "start": 10.617,
              "end": 10.737,
              "score": 0.282,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 10.758,
              "end": 10.778,
              "score": 0.114,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gonna",
              "start": 10.818,
              "end": 11.038,
              "score": 0.574,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 11.078,
              "end": 11.198,
              "score": 0.966,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 11.238,
              "end": 11.338,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "send",
              "start": 11.398,
              "end": 11.618,
              "score": 0.975,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Jamal",
              "start": 11.678,
              "end": 12.099,
              "score": 0.734,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "around",
              "start": 12.119,
              "end": 12.379,
              "score": 0.77,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 12.439,
              "end": 12.559,
              "score": 0.976,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "break",
              "start": 12.619,
              "end": 12.879,
              "score": 0.891,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "your",
              "start": 12.899,
              "end": 13.059,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fucking",
              "start": 13.139,
              "end": 13.52,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "legs?",
              "start": 13.6,
              "end": 13.98,
              "score": 0.956,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 1,
      "seek": 0.149,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 17.13,
      "end": 23.612,
      "text": " Well, since we're in a low between big movie releases and I've got some time on my hands, I guess this is a good time to share my thoughts.",
      "words": [
          {
              "word": "Well,",
              "start": 17.13,
              "end": 17.41,
              "score": 0.9,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "since",
              "start": 17.57,
              "end": 17.79,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "we're",
              "start": 17.81,
              "end": 17.99,
              "score": 0.738,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 18.03,
              "end": 18.09,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 18.13,
              "end": 18.15,
              "score": 0.98,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "low",
              "start": 18.21,
              "end": 18.411,
              "score": 0.72,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "between",
              "start": 18.451,
              "end": 18.791,
              "score": 0.858,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "big",
              "start": 18.831,
              "end": 19.031,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 19.071,
              "end": 19.351,
              "score": 0.702,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "releases",
              "start": 19.391,
              "end": 19.851,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 19.911,
              "end": 19.971,
              "score": 0.983,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 20.011,
              "end": 20.091,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 20.111,
              "end": 20.271,
              "score": 0.618,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "some",
              "start": 20.291,
              "end": 20.451,
              "score": 0.813,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "time",
              "start": 20.511,
              "end": 20.731,
              "score": 0.737,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 20.791,
              "end": 20.871,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "my",
              "start": 20.891,
              "end": 21.011,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hands,",
              "start": 21.032,
              "end": 21.352,
              "score": 0.658,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 21.592,
              "end": 21.632,
              "score": 0.985,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guess",
              "start": 21.652,
              "end": 21.852,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 21.872,
              "end": 22.012,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 22.092,
              "end": 22.152,
              "score": 0.744,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 22.192,
              "end": 22.212,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "good",
              "start": 22.232,
              "end": 22.372,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "time",
              "start": 22.432,
              "end": 22.632,
              "score": 0.987,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 22.692,
              "end": 22.772,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "share",
              "start": 22.832,
              "end": 23.072,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "my",
              "start": 23.092,
              "end": 23.212,
              "score": 0.976,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "thoughts.",
              "start": 23.252,
              "end": 23.612,
              "score": 0.823,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 2,
      "seek": 0.149,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 24.013,
      "end": 26.153,
      "text": "Do you and I have a long history together?",
      "words": [
          {
              "word": "Do",
              "start": 24.013,
              "end": 24.093,
              "score": 0.946,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 24.133,
              "end": 24.293,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 24.333,
              "end": 24.433,
              "score": 0.78,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 24.493,
              "end": 24.573,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 24.633,
              "end": 24.793,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 24.833,
              "end": 24.873,
              "score": 0.784,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "long",
              "start": 24.913,
              "end": 25.113,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "history",
              "start": 25.153,
              "end": 25.633,
              "score": 0.829,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "together?",
              "start": 25.693,
              "end": 26.153,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 3,
      "seek": 0.149,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 26.173,
      "end": 31.996,
      "text": "I read the Frank Herbert novel back when I was a teenager and totally fell in love with the world he'd created.",
      "words": [
          {
              "word": "I",
              "start": 26.173,
              "end": 26.193,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "read",
              "start": 26.534,
              "end": 26.694,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 26.734,
              "end": 26.834,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Frank",
              "start": 26.874,
              "end": 27.114,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Herbert",
              "start": 27.154,
              "end": 27.534,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "novel",
              "start": 27.594,
              "end": 27.914,
              "score": 0.893,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "back",
              "start": 27.954,
              "end": 28.154,
              "score": 0.995,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "when",
              "start": 28.194,
              "end": 28.314,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 28.354,
              "end": 28.394,
              "score": 0.544,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 28.414,
              "end": 28.534,
              "score": 0.696,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 28.594,
              "end": 28.614,
              "score": 0.967,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "teenager",
              "start": 28.654,
              "end": 29.215,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 29.335,
              "end": 29.435,
              "score": 0.754,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "totally",
              "start": 29.495,
              "end": 29.875,
              "score": 0.94,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fell",
              "start": 29.935,
              "end": 30.155,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 30.175,
              "end": 30.235,
              "score": 0.932,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "love",
              "start": 30.275,
              "end": 30.455,
              "score": 0.92,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 30.495,
              "end": 30.635,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 30.675,
              "end": 30.735,
              "score": 0.985,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world",
              "start": 30.795,
              "end": 31.015,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he'd",
              "start": 31.055,
              "end": 31.195,
              "score": 0.687,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "created.",
              "start": 31.275,
              "end": 31.996,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 4,
      "seek": 26.173,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 32.276,
      "end": 44.4,
      "text": "I mean, it's got desert planets, exotic cultures, giant sand worms, decadent civilizations, noble houses plotting and scheming against each other, and epic galaxy spanning conflicts.",
      "words": [
          {
              "word": "I",
              "start": 32.276,
              "end": 32.316,
              "score": 0.718,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mean,",
              "start": 32.336,
              "end": 32.556,
              "score": 0.41,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 32.656,
              "end": 32.776,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 32.816,
              "end": 32.996,
              "score": 0.805,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "desert",
              "start": 33.096,
              "end": 33.496,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "planets,",
              "start": 33.556,
              "end": 34.036,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "exotic",
              "start": 34.217,
              "end": 34.757,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cultures,",
              "start": 34.837,
              "end": 35.417,
              "score": 0.605,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "giant",
              "start": 35.637,
              "end": 36.037,
              "score": 0.807,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sand",
              "start": 36.117,
              "end": 36.417,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "worms,",
              "start": 36.477,
              "end": 36.878,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "decadent",
              "start": 37.058,
              "end": 37.578,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "civilizations,",
              "start": 37.638,
              "end": 38.718,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "noble",
              "start": 39.038,
              "end": 39.338,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "houses",
              "start": 39.398,
              "end": 39.839,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "plotting",
              "start": 39.979,
              "end": 40.359,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 40.399,
              "end": 40.499,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "scheming",
              "start": 40.579,
              "end": 40.979,
              "score": 0.856,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "against",
              "start": 41.019,
              "end": 41.319,
              "score": 0.757,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "each",
              "start": 41.419,
              "end": 41.579,
              "score": 0.968,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "other,",
              "start": 41.659,
              "end": 41.859,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 42.08,
              "end": 42.18,
              "score": 0.671,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "epic",
              "start": 42.32,
              "end": 42.64,
              "score": 0.97,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "galaxy",
              "start": 42.78,
              "end": 43.28,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "spanning",
              "start": 43.3,
              "end": 43.7,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "conflicts.",
              "start": 43.76,
              "end": 44.4,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 5,
      "seek": 26.173,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 44.64,
      "end": 45.621,
      "text": "What's not to like?",
      "words": [
          {
              "word": "What's",
              "start": 44.64,
              "end": 44.881,
              "score": 0.558,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "not",
              "start": 44.921,
              "end": 45.181,
              "score": 0.793,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 45.201,
              "end": 45.321,
              "score": 0.666,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like?",
              "start": 45.361,
              "end": 45.621,
              "score": 0.973,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 6,
      "seek": 26.173,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 46.021,
      "end": 51.043,
      "text": " Yeah, some of it seems a bit quaint and anachronistic by today's standards, but what the fuck?",
      "words": [
          {
              "word": "Yeah,",
              "start": 46.021,
              "end": 46.321,
              "score": 0.61,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "some",
              "start": 46.461,
              "end": 46.641,
              "score": 0.713,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 46.681,
              "end": 46.741,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 46.821,
              "end": 46.881,
              "score": 0.972,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "seems",
              "start": 46.941,
              "end": 47.202,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 47.242,
              "end": 47.262,
              "score": 0.952,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bit",
              "start": 47.302,
              "end": 47.422,
              "score": 0.852,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "quaint",
              "start": 47.522,
              "end": 47.882,
              "score": 0.699,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 47.962,
              "end": 48.042,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "anachronistic",
              "start": 48.102,
              "end": 48.922,
              "score": 0.803,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "by",
              "start": 48.962,
              "end": 49.122,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "today's",
              "start": 49.162,
              "end": 49.523,
              "score": 0.795,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "standards,",
              "start": 49.583,
              "end": 50.063,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 50.103,
              "end": 50.223,
              "score": 0.959,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "what",
              "start": 50.263,
              "end": 50.443,
              "score": 0.904,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 50.483,
              "end": 50.563,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fuck?",
              "start": 50.643,
              "end": 51.043,
              "score": 0.782,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 7,
      "seek": 26.173,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 51.263,
      "end": 56.586,
      "text": "For a book written in the 1960s, it's aged a lot better than most of today's shite is likely to.",
      "words": [
          {
              "word": "For",
              "start": 51.263,
              "end": 51.403,
              "score": 0.732,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 51.443,
              "end": 51.483,
              "score": 0.501,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "book",
              "start": 51.503,
              "end": 51.684,
              "score": 0.979,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "written",
              "start": 51.724,
              "end": 52.004,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 52.044,
              "end": 52.104,
              "score": 0.94,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 52.124,
              "end": 52.624,
              "score": 0.556,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "1960s,",
              "start": 52.724,
              "end": 53.224,
              "score": 0.62,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 53.404,
              "end": 53.524,
              "score": 0.638,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "aged",
              "start": 53.624,
              "end": 53.784,
              "score": 0.716,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 53.865,
              "end": 53.945,
              "score": 0.445,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "lot",
              "start": 53.985,
              "end": 54.105,
              "score": 0.673,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "better",
              "start": 54.125,
              "end": 54.365,
              "score": 0.894,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "than",
              "start": 54.405,
              "end": 54.505,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "most",
              "start": 54.545,
              "end": 54.765,
              "score": 0.767,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 54.805,
              "end": 54.865,
              "score": 0.958,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "today's",
              "start": 54.925,
              "end": 55.325,
              "score": 0.738,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "shite",
              "start": 55.465,
              "end": 55.745,
              "score": 0.609,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 55.805,
              "end": 55.885,
              "score": 0.502,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "likely",
              "start": 55.925,
              "end": 56.306,
              "score": 0.883,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to.",
              "start": 56.366,
              "end": 56.586,
              "score": 0.754,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 8,
      "seek": 26.173,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 56.806,
      "end": 62.208,
      "text": "There's been plenty of attempts to adapt it to the big screen over the years, with varying degrees of success.",
      "words": [
          {
              "word": "There's",
              "start": 56.806,
              "end": 56.986,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "been",
              "start": 57.006,
              "end": 57.146,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "plenty",
              "start": 57.166,
              "end": 57.446,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 57.486,
              "end": 57.546,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "attempts",
              "start": 57.606,
              "end": 57.946,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 57.986,
              "end": 58.126,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "adapt",
              "start": 58.186,
              "end": 58.507,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 58.567,
              "end": 58.627,
              "score": 0.772,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 58.667,
              "end": 58.767,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 58.787,
              "end": 58.867,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "big",
              "start": 58.907,
              "end": 59.087,
              "score": 0.891,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "screen",
              "start": 59.127,
              "end": 59.427,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "over",
              "start": 59.467,
              "end": 59.627,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 59.667,
              "end": 59.727,
              "score": 0.986,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "years,",
              "start": 59.767,
              "end": 60.047,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 60.247,
              "end": 60.407,
              "score": 0.904,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "varying",
              "start": 60.447,
              "end": 60.868,
              "score": 0.803,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "degrees",
              "start": 60.948,
              "end": 61.368,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 61.428,
              "end": 61.488,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "success.",
              "start": 61.588,
              "end": 62.208,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 9,
      "seek": 56.806,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 62.588,
      "end": 70.352,
      "text": "A 1970s version ended up trapped in development hell for years, eventually sinking under the colossal budget requirements,",
      "words": [
          {
              "word": "A",
              "start": 62.588,
              "end": 63.049,
              "score": 0.47,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "1970s",
              "start": 63.129,
              "end": 63.569,
              "score": 0.484,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "version",
              "start": 63.629,
              "end": 64.049,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ended",
              "start": 64.169,
              "end": 64.389,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "up",
              "start": 64.449,
              "end": 64.549,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "trapped",
              "start": 64.629,
              "end": 64.949,
              "score": 0.718,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 65.01,
              "end": 65.11,
              "score": 0.734,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "development",
              "start": 65.15,
              "end": 65.71,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hell",
              "start": 65.75,
              "end": 66.03,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 66.09,
              "end": 66.25,
              "score": 0.811,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "years,",
              "start": 66.35,
              "end": 66.89,
              "score": 0.598,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "eventually",
              "start": 67.271,
              "end": 67.751,
              "score": 0.816,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sinking",
              "start": 67.851,
              "end": 68.251,
              "score": 0.924,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "under",
              "start": 68.351,
              "end": 68.551,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 68.571,
              "end": 68.651,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "colossal",
              "start": 68.731,
              "end": 69.211,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "budget",
              "start": 69.291,
              "end": 69.652,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "requirements,",
              "start": 69.692,
              "end": 70.352,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 10,
      "seek": 56.806,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 70.632,
      "end": 76.134,
      "text": " While the David Lynch movie from 1984 was a critical failure and a box office bomb.",
      "words": [
          {
              "word": "While",
              "start": 70.632,
              "end": 70.792,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 70.812,
              "end": 70.892,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "David",
              "start": 70.932,
              "end": 71.212,
              "score": 0.962,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Lynch",
              "start": 71.272,
              "end": 71.532,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 71.592,
              "end": 72.453,
              "score": 0.652,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "from",
              "start": 72.733,
              "end": 73.033,
              "score": 0.364,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "1984"
          },
          {
              "word": "was",
              "start": 73.153,
              "end": 73.293,
              "score": 0.781,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 73.353,
              "end": 73.373,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "critical",
              "start": 73.453,
              "end": 73.853,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "failure",
              "start": 73.953,
              "end": 74.373,
              "score": 0.823,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 74.693,
              "end": 74.853,
              "score": 0.634,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 74.913,
              "end": 74.953,
              "score": 0.589,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "box",
              "start": 74.993,
              "end": 75.333,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "office",
              "start": 75.353,
              "end": 75.654,
              "score": 0.551,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bomb.",
              "start": 75.734,
              "end": 76.134,
              "score": 0.774,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 11,
      "seek": 56.806,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 76.414,
      "end": 78.474,
      "text": "And to be honest, I can totally see why.",
      "words": [
          {
              "word": "And",
              "start": 76.414,
              "end": 76.494,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 76.514,
              "end": 76.614,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 76.654,
              "end": 76.734,
              "score": 0.894,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "honest,",
              "start": 76.754,
              "end": 77.054,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 77.214,
              "end": 77.274,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 77.294,
              "end": 77.434,
              "score": 0.946,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "totally",
              "start": 77.474,
              "end": 77.874,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "see",
              "start": 77.914,
              "end": 78.054,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "why.",
              "start": 78.114,
              "end": 78.474,
              "score": 0.9,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 12,
      "seek": 56.806,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 78.494,
      "end": 94.919,
      "text": "It oversimplifies and condenses a lot of the story, and despite his claims that the studio had more control over it than he did, it's still a very David Lynch kind of movie, with all the weird visuals, psychedelic dream sequences, and abstract symbolism he's so fucking in love with.",
      "words": [
          {
              "word": "It",
              "start": 78.494,
              "end": 78.534,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "oversimplifies",
              "start": 78.935,
              "end": 79.855,
              "score": 0.872,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 79.915,
              "end": 80.015,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "condenses",
              "start": 80.055,
              "end": 80.635,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 80.695,
              "end": 80.715,
              "score": 0.812,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "lot",
              "start": 80.755,
              "end": 80.915,
              "score": 0.403,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 80.935,
              "end": 80.995,
              "score": 0.752,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 81.035,
              "end": 81.115,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "story,",
              "start": 81.175,
              "end": 81.615,
              "score": 0.774,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 81.835,
              "end": 81.915,
              "score": 0.898,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "despite",
              "start": 81.955,
              "end": 82.336,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 82.376,
              "end": 82.496,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "claims",
              "start": 82.596,
              "end": 82.916,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 82.976,
              "end": 83.096,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 83.136,
              "end": 83.216,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "studio",
              "start": 83.256,
              "end": 83.676,
              "score": 0.898,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "had",
              "start": 83.716,
              "end": 83.856,
              "score": 0.882,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "more",
              "start": 83.896,
              "end": 84.056,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "control",
              "start": 84.096,
              "end": 84.516,
              "score": 0.741,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "over",
              "start": 84.596,
              "end": 84.776,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 84.796,
              "end": 84.856,
              "score": 0.686,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "than",
              "start": 84.896,
              "end": 85.036,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he",
              "start": 85.076,
              "end": 85.236,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "did,",
              "start": 85.276,
              "end": 85.497,
              "score": 0.678,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 85.737,
              "end": 85.877,
              "score": 0.764,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "still",
              "start": 85.977,
              "end": 86.277,
              "score": 0.793,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 86.297,
              "end": 86.337,
              "score": 0.499,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "very",
              "start": 86.477,
              "end": 86.877,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "David",
              "start": 86.957,
              "end": 87.297,
              "score": 0.995,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Lynch",
              "start": 87.377,
              "end": 87.637,
              "score": 0.934,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kind",
              "start": 87.697,
              "end": 87.897,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 87.937,
              "end": 87.997,
              "score": 0.688,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie,",
              "start": 88.017,
              "end": 88.417,
              "score": 0.672,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 88.537,
              "end": 88.657,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 88.717,
              "end": 88.858,
              "score": 0.78,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 88.878,
              "end": 88.938,
              "score": 0.892,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "weird",
              "start": 89.058,
              "end": 89.338,
              "score": 0.972,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "visuals,",
              "start": 89.438,
              "end": 89.958,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "psychedelic",
              "start": 90.238,
              "end": 90.898,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "dream",
              "start": 90.958,
              "end": 91.238,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sequences,",
              "start": 91.298,
              "end": 91.938,
              "score": 0.937,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 92.139,
              "end": 92.219,
              "score": 0.848,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "abstract",
              "start": 92.319,
              "end": 92.759,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "symbolism",
              "start": 92.819,
              "end": 93.399,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he's",
              "start": 93.419,
              "end": 93.559,
              "score": 0.546,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so",
              "start": 93.599,
              "end": 93.779,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fucking",
              "start": 93.819,
              "end": 94.199,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 94.239,
              "end": 94.339,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "love",
              "start": 94.399,
              "end": 94.619,
              "score": 0.994,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with.",
              "start": 94.679,
              "end": 94.919,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 13,
      "seek": 78.494,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 95.159,
      "end": 100.061,
      "text": "Whether you consider that a good or a bad thing depends mostly on whether you're a fan of Lynch's work.",
      "words": [
          {
              "word": "Whether",
              "start": 95.159,
              "end": 95.379,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 95.419,
              "end": 95.54,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "consider",
              "start": 95.56,
              "end": 95.96,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 96.0,
              "end": 96.14,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 96.16,
              "end": 96.18,
              "score": 0.047,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "good",
              "start": 96.24,
              "end": 96.42,
              "score": 0.985,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "or",
              "start": 96.46,
              "end": 96.58,
              "score": 0.688,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 96.6,
              "end": 96.62,
              "score": 0.991,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bad",
              "start": 96.68,
              "end": 96.88,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "thing",
              "start": 96.96,
              "end": 97.18,
              "score": 0.787,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "depends",
              "start": 97.24,
              "end": 97.6,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mostly",
              "start": 97.66,
              "end": 98.08,
              "score": 0.912,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 98.2,
              "end": 98.26,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "whether",
              "start": 98.28,
              "end": 98.56,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you're",
              "start": 98.58,
              "end": 98.781,
              "score": 0.524,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 98.801,
              "end": 98.861,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fan",
              "start": 98.901,
              "end": 99.101,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 99.141,
              "end": 99.201,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Lynch's",
              "start": 99.261,
              "end": 99.681,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "work.",
              "start": 99.761,
              "end": 100.061,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 14,
      "seek": 78.494,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 100.541,
      "end": 112.134,
      "text": " Either way, the film's failure killed the possibility of a larger franchise, and it wasn't until the 2000s that the sci-fi channel of all people put out a mini-series that actually turned out to be pretty decent.",
      "words": [
          {
              "word": "Either",
              "start": 100.541,
              "end": 100.761,
              "score": 0.757,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "way,",
              "start": 100.821,
              "end": 101.022,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 101.142,
              "end": 101.242,
              "score": 0.735,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "film's",
              "start": 101.282,
              "end": 101.602,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "failure",
              "start": 101.682,
              "end": 102.043,
              "score": 0.848,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "killed",
              "start": 102.103,
              "end": 102.343,
              "score": 0.913,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 102.363,
              "end": 102.443,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "possibility",
              "start": 102.483,
              "end": 103.204,
              "score": 0.968,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 103.264,
              "end": 103.324,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 103.364,
              "end": 103.404,
              "score": 0.469,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "larger",
              "start": 103.444,
              "end": 103.765,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "franchise,",
              "start": 103.845,
              "end": 104.486,
              "score": 0.936,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 104.646,
              "end": 104.726,
              "score": 0.921,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 104.766,
              "end": 104.806,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wasn't",
              "start": 104.866,
              "end": 105.106,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "until",
              "start": 105.166,
              "end": 105.447,
              "score": 0.732,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 105.467,
              "end": 105.547,
              "score": 0.83,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "2000s",
              "start": 106.047,
              "end": 106.287,
              "score": 0.456,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 106.448,
              "end": 106.608,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 106.628,
              "end": 106.728,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sci-fi",
              "start": 106.888,
              "end": 107.509,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "channel",
              "start": 107.569,
              "end": 107.949,
              "score": 0.916,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 108.009,
              "end": 108.089,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 108.17,
              "end": 108.29,
              "score": 0.943,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "people",
              "start": 108.37,
              "end": 108.73,
              "score": 0.932,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "put",
              "start": 108.93,
              "end": 109.111,
              "score": 0.918,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 109.151,
              "end": 109.271,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 109.291,
              "end": 109.331,
              "score": 0.488,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mini-series",
              "start": 109.411,
              "end": 110.052,
              "score": 0.662,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 110.192,
              "end": 110.332,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "actually",
              "start": 110.372,
              "end": 110.672,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "turned",
              "start": 110.732,
              "end": 110.953,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 111.033,
              "end": 111.133,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 111.173,
              "end": 111.233,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 111.273,
              "end": 111.353,
              "score": 0.969,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 111.413,
              "end": 111.633,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "decent.",
              "start": 111.693,
              "end": 112.134,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 15,
      "seek": 78.494,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 112.414,
      "end": 119.242,
      "text": "Yeah, the budget couldn't really match its ambitions, but the cast was solid and the right intentions were definitely there, and overall, it",
      "words": [
          {
              "word": "Yeah,",
              "start": 112.414,
              "end": 112.675,
              "score": 0.709,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 112.735,
              "end": 112.815,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "budget",
              "start": 112.835,
              "end": 113.195,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "couldn't",
              "start": 113.215,
              "end": 113.455,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "really",
              "start": 113.515,
              "end": 113.756,
              "score": 0.762,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "match",
              "start": 113.796,
              "end": 114.056,
              "score": 0.977,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "its",
              "start": 114.096,
              "end": 114.256,
              "score": 0.495,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ambitions,",
              "start": 114.356,
              "end": 114.997,
              "score": 0.829,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 115.277,
              "end": 115.377,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 115.418,
              "end": 115.498,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cast",
              "start": 115.518,
              "end": 115.818,
              "score": 0.973,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 115.858,
              "end": 115.978,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "solid",
              "start": 116.038,
              "end": 116.399,
              "score": 0.814,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 116.439,
              "end": 116.519,
              "score": 0.869,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 116.559,
              "end": 116.639,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "right",
              "start": 116.679,
              "end": 116.839,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "intentions",
              "start": 116.879,
              "end": 117.42,
              "score": 0.891,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "were",
              "start": 117.44,
              "end": 117.58,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "definitely",
              "start": 117.62,
              "end": 118.06,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "there,",
              "start": 118.101,
              "end": 118.341,
              "score": 0.747,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 118.581,
              "end": 118.681,
              "score": 0.713,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "overall,",
              "start": 118.741,
              "end": 119.182,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 119.202,
              "end": 119.242,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 16,
      "seek": 78.494,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 119.462,
      "end": 120.223,
      "text": " It was okay.",
      "words": [
          {
              "word": "It",
              "start": 119.462,
              "end": 119.502,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 119.522,
              "end": 119.642,
              "score": 0.792,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "okay.",
              "start": 119.722,
              "end": 120.223,
              "score": 0.635,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 17,
      "seek": 119.462,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 120.463,
      "end": 121.844,
      "text": "Not great, but okay.",
      "words": [
          {
              "word": "Not",
              "start": 120.463,
              "end": 120.623,
              "score": 0.995,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "great,",
              "start": 120.683,
              "end": 120.963,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 121.143,
              "end": 121.243,
              "score": 0.994,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "okay.",
              "start": 121.364,
              "end": 121.844,
              "score": 0.678,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 18,
      "seek": 119.462,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 122.104,
      "end": 132.953,
      "text": "And for the next 20 years or so, not much more was heard about the world of Dune, which brings us at last to 2021 and the upcoming release of Dennis Villeneuve's long delayed adaptation.",
      "words": [
          {
              "word": "And",
              "start": 122.104,
              "end": 122.204,
              "score": 0.713,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 122.224,
              "end": 122.324,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 122.344,
              "end": 122.424,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "next",
              "start": 122.464,
              "end": 122.605,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "20"
          },
          {
              "word": "years",
              "start": 122.985,
              "end": 123.205,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "or",
              "start": 123.285,
              "end": 123.365,
              "score": 0.725,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so,",
              "start": 123.425,
              "end": 123.625,
              "score": 0.852,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "not",
              "start": 123.926,
              "end": 124.106,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 124.146,
              "end": 124.326,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "more",
              "start": 124.386,
              "end": 124.546,
              "score": 0.883,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 124.586,
              "end": 124.726,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "heard",
              "start": 124.766,
              "end": 124.967,
              "score": 0.886,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 125.027,
              "end": 125.227,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 125.267,
              "end": 125.347,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world",
              "start": 125.387,
              "end": 125.667,
              "score": 0.774,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 125.727,
              "end": 125.787,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Dune,",
              "start": 125.867,
              "end": 126.228,
              "score": 0.852,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 126.568,
              "end": 126.748,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "brings",
              "start": 126.828,
              "end": 127.088,
              "score": 0.901,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "us",
              "start": 127.168,
              "end": 127.268,
              "score": 0.584,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "at",
              "start": 127.328,
              "end": 127.389,
              "score": 0.97,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "last",
              "start": 127.429,
              "end": 128.229,
              "score": 0.716,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 128.289,
              "end": 128.85,
              "score": 0.498,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "2021"
          },
          {
              "word": "and",
              "start": 129.09,
              "end": 129.17,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 129.19,
              "end": 129.27,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "upcoming",
              "start": 129.33,
              "end": 129.79,
              "score": 0.815,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "release",
              "start": 129.831,
              "end": 130.211,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 130.271,
              "end": 130.351,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Dennis",
              "start": 130.411,
              "end": 130.751,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Villeneuve's",
              "start": 130.791,
              "end": 131.392,
              "score": 0.685,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "long",
              "start": 131.452,
              "end": 131.672,
              "score": 0.789,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "delayed",
              "start": 131.712,
              "end": 132.032,
              "score": 0.986,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "adaptation.",
              "start": 132.132,
              "end": 132.953,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 19,
      "seek": 119.462,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 133.193,
      "end": 137.837,
      "text": "Jesus, that first trailer came out so fucking long ago, I think I was still sober at the time.",
      "words": [
          {
              "word": "Jesus,",
              "start": 133.193,
              "end": 133.554,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 133.594,
              "end": 133.754,
              "score": 0.984,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "first",
              "start": 133.794,
              "end": 134.014,
              "score": 0.67,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "trailer",
              "start": 134.074,
              "end": 134.414,
              "score": 0.811,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "came",
              "start": 134.454,
              "end": 134.634,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 134.674,
              "end": 134.775,
              "score": 0.813,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so",
              "start": 134.795,
              "end": 134.955,
              "score": 0.946,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fucking",
              "start": 134.975,
              "end": 135.315,
              "score": 0.773,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "long",
              "start": 135.355,
              "end": 135.535,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ago,",
              "start": 135.575,
              "end": 135.775,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 136.056,
              "end": 136.116,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 136.136,
              "end": 136.296,
              "score": 0.916,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 136.336,
              "end": 136.396,
              "score": 0.677,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 136.416,
              "end": 136.536,
              "score": 0.739,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "still",
              "start": 136.576,
              "end": 136.816,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sober",
              "start": 136.916,
              "end": 137.317,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "at",
              "start": 137.337,
              "end": 137.397,
              "score": 0.749,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 137.437,
              "end": 137.537,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "time.",
              "start": 137.577,
              "end": 137.837,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 20,
      "seek": 119.462,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 137.857,
      "end": 139.999,
      "text": "Nah, I just kidding, I've never been sober.",
      "words": [
          {
              "word": "Nah,",
              "start": 137.857,
              "end": 137.917,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 138.257,
              "end": 138.358,
              "score": 0.724,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "just",
              "start": 138.498,
              "end": 138.638,
              "score": 0.536,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kidding,",
              "start": 138.678,
              "end": 138.998,
              "score": 0.637,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 139.058,
              "end": 139.198,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "never",
              "start": 139.238,
              "end": 139.418,
              "score": 0.713,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "been",
              "start": 139.458,
              "end": 139.619,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sober.",
              "start": 139.679,
              "end": 139.999,
              "score": 0.901,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 21,
      "seek": 119.462,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 140.239,
      "end": 152.002,
      "text": " But anyway, after a pretty grim year were the unspecified virus of unknown origin, pretty much delayed every major release, the movie's finally on the way, and the publicity machine is cranking into high gear.",
      "words": [
          {
              "word": "But",
              "start": 140.239,
              "end": 140.339,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "anyway,",
              "start": 140.419,
              "end": 140.719,
              "score": 0.843,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "after",
              "start": 140.899,
              "end": 141.119,
              "score": 0.715,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 141.179,
              "end": 141.199,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 141.259,
              "end": 141.499,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "grim",
              "start": 141.539,
              "end": 141.819,
              "score": 0.92,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "year",
              "start": 141.859,
              "end": 142.139,
              "score": 0.714,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "were",
              "start": 142.239,
              "end": 142.42,
              "score": 0.695,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 142.44,
              "end": 142.54,
              "score": 0.674,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "unspecified",
              "start": 142.74,
              "end": 143.6,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "virus",
              "start": 143.66,
              "end": 144.12,
              "score": 0.757,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 144.18,
              "end": 144.26,
              "score": 0.74,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "unknown",
              "start": 144.34,
              "end": 144.7,
              "score": 0.813,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "origin,",
              "start": 144.8,
              "end": 145.26,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 145.46,
              "end": 145.68,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 145.72,
              "end": 145.94,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "delayed",
              "start": 146.02,
              "end": 146.34,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "every",
              "start": 146.42,
              "end": 146.661,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "major",
              "start": 146.701,
              "end": 147.041,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "release,",
              "start": 147.101,
              "end": 147.481,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 147.661,
              "end": 147.741,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie's",
              "start": 147.781,
              "end": 148.101,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "finally",
              "start": 148.201,
              "end": 148.561,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 148.641,
              "end": 148.701,
              "score": 0.918,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 148.741,
              "end": 148.841,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "way,",
              "start": 148.881,
              "end": 149.101,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 149.221,
              "end": 149.301,
              "score": 0.913,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 149.341,
              "end": 149.421,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "publicity",
              "start": 149.461,
              "end": 150.021,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "machine",
              "start": 150.061,
              "end": 150.361,
              "score": 0.967,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 150.421,
              "end": 150.481,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cranking",
              "start": 150.601,
              "end": 151.002,
              "score": 0.784,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "into",
              "start": 151.042,
              "end": 151.282,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "high",
              "start": 151.342,
              "end": 151.542,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gear.",
              "start": 151.582,
              "end": 152.002,
              "score": 0.809,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 22,
      "seek": 140.239,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 152.222,
      "end": 154.262,
      "text": "So what the hell do I actually think about it?",
      "words": [
          {
              "word": "So",
              "start": 152.222,
              "end": 152.342,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "what",
              "start": 152.382,
              "end": 152.502,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 152.522,
              "end": 152.602,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hell",
              "start": 152.622,
              "end": 152.762,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "do",
              "start": 152.782,
              "end": 152.902,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 152.962,
              "end": 153.022,
              "score": 0.662,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "actually",
              "start": 153.082,
              "end": 153.402,
              "score": 0.893,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 153.442,
              "end": 153.622,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 153.702,
              "end": 153.982,
              "score": 0.974,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it?",
              "start": 154.142,
              "end": 154.262,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 23,
      "seek": 140.239,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 154.422,
      "end": 161.444,
      "text": "Well, after watching every trailer and feature it I could get my hands on, I have to admit, I'm cautiously optimistic about this one.",
      "words": [
          {
              "word": "Well,",
              "start": 154.422,
              "end": 154.622,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "after",
              "start": 154.822,
              "end": 155.042,
              "score": 0.828,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "watching",
              "start": 155.102,
              "end": 155.423,
              "score": 0.961,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "every",
              "start": 155.543,
              "end": 155.763,
              "score": 0.774,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "trailer",
              "start": 155.823,
              "end": 156.243,
              "score": 0.761,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 156.303,
              "end": 156.383,
              "score": 0.571,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "feature",
              "start": 156.443,
              "end": 156.783,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 156.843,
              "end": 156.943,
              "score": 0.582,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 156.963,
              "end": 157.023,
              "score": 0.512,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 157.043,
              "end": 157.183,
              "score": 0.689,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 157.203,
              "end": 157.343,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "my",
              "start": 157.363,
              "end": 157.463,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hands",
              "start": 157.483,
              "end": 157.763,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on,",
              "start": 157.883,
              "end": 158.003,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 158.323,
              "end": 158.403,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 158.423,
              "end": 158.563,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 158.623,
              "end": 158.743,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "admit,",
              "start": 158.803,
              "end": 159.083,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I'm",
              "start": 159.323,
              "end": 159.443,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cautiously",
              "start": 159.503,
              "end": 160.024,
              "score": 0.924,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "optimistic",
              "start": 160.084,
              "end": 160.664,
              "score": 0.791,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 160.724,
              "end": 160.944,
              "score": 0.81,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 161.004,
              "end": 161.164,
              "score": 0.878,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one.",
              "start": 161.344,
              "end": 161.444,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 24,
      "seek": 140.239,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 161.744,
      "end": 167.647,
      "text": " Yeah, I've got a few concerns and reservations that I'll talk about later, but overall, I think this could be a real winner.",
      "words": [
          {
              "word": "Yeah,",
              "start": 161.744,
              "end": 162.004,
              "score": 0.582,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 162.084,
              "end": 162.224,
              "score": 0.755,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 162.244,
              "end": 162.424,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 162.444,
              "end": 162.464,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "few",
              "start": 162.504,
              "end": 162.664,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "concerns",
              "start": 162.725,
              "end": 163.165,
              "score": 0.856,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 163.225,
              "end": 163.325,
              "score": 0.782,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "reservations",
              "start": 163.365,
              "end": 164.005,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 164.045,
              "end": 164.165,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I'll",
              "start": 164.185,
              "end": 164.325,
              "score": 0.816,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "talk",
              "start": 164.365,
              "end": 164.545,
              "score": 0.987,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 164.605,
              "end": 164.826,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "later,",
              "start": 164.866,
              "end": 165.266,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 165.426,
              "end": 165.546,
              "score": 0.853,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "overall,",
              "start": 165.626,
              "end": 166.046,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 166.186,
              "end": 166.246,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 166.266,
              "end": 166.426,
              "score": 0.893,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 166.466,
              "end": 166.606,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 166.666,
              "end": 166.827,
              "score": 0.783,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 166.847,
              "end": 166.967,
              "score": 0.814,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 166.987,
              "end": 167.027,
              "score": 0.498,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "real",
              "start": 167.087,
              "end": 167.287,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "winner.",
              "start": 167.327,
              "end": 167.647,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 25,
      "seek": 140.239,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 168.087,
      "end": 170.128,
      "text": "Allow me to expand your mind.",
      "words": [
          {
              "word": "Allow",
              "start": 168.087,
              "end": 168.347,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "me",
              "start": 168.367,
              "end": 168.487,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 168.547,
              "end": 168.687,
              "score": 0.702,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "expand",
              "start": 168.767,
              "end": 169.448,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "your",
              "start": 169.488,
              "end": 169.668,
              "score": 0.862,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mind.",
              "start": 169.708,
              "end": 170.128,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 26,
      "seek": 140.239,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 170.608,
      "end": 173.01,
      "text": "Dune is set several thousand years from now.",
      "words": [
          {
              "word": "Dune",
              "start": 170.608,
              "end": 170.888,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 170.949,
              "end": 171.049,
              "score": 0.934,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "set",
              "start": 171.109,
              "end": 171.369,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "several",
              "start": 171.449,
              "end": 171.809,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "thousand",
              "start": 171.869,
              "end": 172.249,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "years",
              "start": 172.269,
              "end": 172.509,
              "score": 0.657,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "from",
              "start": 172.569,
              "end": 172.729,
              "score": 0.924,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "now.",
              "start": 172.789,
              "end": 173.01,
              "score": 0.875,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 27,
      "seek": 140.239,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 173.23,
      "end": 183.995,
      "text": "The human race is spread out to colonise most of the galaxy, which is now controlled by a kind of feudal empire, headed up by a bunch of noble houses that are constantly vying for favour and influence.",
      "words": [
          {
              "word": "The",
              "start": 173.23,
              "end": 173.31,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "human",
              "start": 173.35,
              "end": 173.61,
              "score": 0.9,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "race",
              "start": 173.67,
              "end": 173.85,
              "score": 0.858,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 173.91,
              "end": 173.97,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "spread",
              "start": 174.01,
              "end": 174.27,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 174.33,
              "end": 174.43,
              "score": 0.955,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 174.47,
              "end": 174.55,
              "score": 0.759,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "colonise",
              "start": 174.61,
              "end": 175.111,
              "score": 0.809,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "most",
              "start": 175.151,
              "end": 175.351,
              "score": 0.668,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 175.391,
              "end": 175.451,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 175.491,
              "end": 175.551,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "galaxy,",
              "start": 175.591,
              "end": 176.171,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 176.331,
              "end": 176.491,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 176.551,
              "end": 176.631,
              "score": 0.593,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "now",
              "start": 176.671,
              "end": 176.811,
              "score": 0.985,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "controlled",
              "start": 176.871,
              "end": 177.352,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "by",
              "start": 177.432,
              "end": 177.572,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 177.612,
              "end": 177.632,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kind",
              "start": 177.712,
              "end": 177.912,
              "score": 0.78,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 177.952,
              "end": 178.012,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "feudal",
              "start": 178.172,
              "end": 178.572,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "empire,",
              "start": 178.732,
              "end": 179.193,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "headed",
              "start": 179.413,
              "end": 179.673,
              "score": 0.912,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "up",
              "start": 179.753,
              "end": 179.833,
              "score": 0.776,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "by",
              "start": 179.873,
              "end": 180.013,
              "score": 0.734,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 180.053,
              "end": 180.073,
              "score": 0.995,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bunch",
              "start": 180.113,
              "end": 180.313,
              "score": 0.954,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 180.373,
              "end": 180.413,
              "score": 1.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "noble",
              "start": 180.493,
              "end": 180.773,
              "score": 0.819,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "houses",
              "start": 180.813,
              "end": 181.234,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 181.334,
              "end": 181.474,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "are",
              "start": 181.514,
              "end": 181.614,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "constantly",
              "start": 181.654,
              "end": 182.214,
              "score": 0.837,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "vying",
              "start": 182.274,
              "end": 182.634,
              "score": 0.53,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 182.694,
              "end": 182.814,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "favour",
              "start": 182.874,
              "end": 183.234,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 183.295,
              "end": 183.395,
              "score": 0.799,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "influence.",
              "start": 183.435,
              "end": 183.995,
              "score": 0.857,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 28,
      "seek": 173.23,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 184.375,
      "end": 193.042,
      "text": " It's all a bit decadent and corrupt, and the average human doesn't get to see much of the enormous wealth that these people control, but it allows them to maintain their grip on power.",
      "words": [
          {
              "word": "It's",
              "start": 184.375,
              "end": 184.515,
              "score": 0.805,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 184.575,
              "end": 184.715,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 184.755,
              "end": 184.775,
              "score": 0.957,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bit",
              "start": 184.815,
              "end": 184.956,
              "score": 0.894,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "decadent",
              "start": 185.016,
              "end": 185.516,
              "score": 0.919,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 185.576,
              "end": 185.656,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "corrupt,",
              "start": 185.736,
              "end": 186.216,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 186.397,
              "end": 186.477,
              "score": 0.848,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 186.497,
              "end": 186.577,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "average",
              "start": 186.637,
              "end": 186.917,
              "score": 0.795,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "human",
              "start": 186.957,
              "end": 187.257,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "doesn't",
              "start": 187.317,
              "end": 187.557,
              "score": 0.961,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 187.598,
              "end": 187.718,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 187.758,
              "end": 187.818,
              "score": 0.707,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "see",
              "start": 187.878,
              "end": 188.038,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 188.078,
              "end": 188.258,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 188.298,
              "end": 188.338,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 188.378,
              "end": 188.458,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "enormous",
              "start": 188.518,
              "end": 188.939,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wealth",
              "start": 188.999,
              "end": 189.239,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 189.279,
              "end": 189.399,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "these",
              "start": 189.439,
              "end": 189.599,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "people",
              "start": 189.639,
              "end": 189.919,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "control,",
              "start": 189.959,
              "end": 190.46,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 190.64,
              "end": 190.76,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 190.8,
              "end": 190.84,
              "score": 0.972,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "allows",
              "start": 190.92,
              "end": 191.2,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "them",
              "start": 191.24,
              "end": 191.36,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 191.42,
              "end": 191.5,
              "score": 0.875,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "maintain",
              "start": 191.561,
              "end": 192.001,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "their",
              "start": 192.061,
              "end": 192.201,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "grip",
              "start": 192.241,
              "end": 192.441,
              "score": 0.939,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 192.521,
              "end": 192.601,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "power.",
              "start": 192.661,
              "end": 193.042,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 29,
      "seek": 173.23,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 193.302,
      "end": 204.07,
      "text": "All of this stuff is made possible by a rare material known as Spice, which can grant its user prolonged life, heightened awareness and a kind of psychic vision that allows space pilots to",
      "words": [
          {
              "word": "All",
              "start": 193.302,
              "end": 193.442,
              "score": 0.752,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 193.462,
              "end": 193.502,
              "score": 0.691,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 193.562,
              "end": 193.702,
              "score": 0.886,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stuff",
              "start": 193.762,
              "end": 194.062,
              "score": 0.998,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 194.183,
              "end": 194.263,
              "score": 0.505,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "made",
              "start": 194.303,
              "end": 194.463,
              "score": 0.944,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "possible",
              "start": 194.523,
              "end": 194.963,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "by",
              "start": 195.043,
              "end": 195.183,
              "score": 0.766,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 195.223,
              "end": 195.263,
              "score": 0.485,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "rare",
              "start": 195.323,
              "end": 195.524,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "material",
              "start": 195.584,
              "end": 196.144,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "known",
              "start": 196.244,
              "end": 196.464,
              "score": 0.809,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "as",
              "start": 196.524,
              "end": 196.604,
              "score": 0.773,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Spice,",
              "start": 196.764,
              "end": 197.285,
              "score": 0.811,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 197.565,
              "end": 197.705,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 197.765,
              "end": 197.905,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "grant",
              "start": 197.965,
              "end": 198.226,
              "score": 0.766,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "its",
              "start": 198.286,
              "end": 198.386,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "user",
              "start": 198.546,
              "end": 198.826,
              "score": 0.694,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "prolonged",
              "start": 198.886,
              "end": 199.386,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "life,",
              "start": 199.446,
              "end": 199.707,
              "score": 0.978,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "heightened",
              "start": 200.007,
              "end": 200.387,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "awareness",
              "start": 200.447,
              "end": 200.928,
              "score": 0.872,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 201.208,
              "end": 201.288,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 201.328,
              "end": 201.348,
              "score": 0.991,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kind",
              "start": 201.428,
              "end": 201.648,
              "score": 0.754,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 201.708,
              "end": 201.768,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "psychic",
              "start": 201.908,
              "end": 202.309,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "vision",
              "start": 202.409,
              "end": 202.749,
              "score": 0.764,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 202.829,
              "end": 202.949,
              "score": 0.971,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "allows",
              "start": 203.009,
              "end": 203.289,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "space",
              "start": 203.349,
              "end": 203.65,
              "score": 0.953,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pilots",
              "start": 203.69,
              "end": 204.01,
              "score": 0.936,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 204.03,
              "end": 204.07,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 30,
      "seek": 173.23,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 204.21,
      "end": 206.592,
      "text": " navigate from one side of the Empire to the other.",
      "words": [
          {
              "word": "navigate",
              "start": 204.21,
              "end": 204.63,
              "score": 0.819,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "from",
              "start": 204.67,
              "end": 204.791,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one",
              "start": 204.891,
              "end": 205.011,
              "score": 0.815,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "side",
              "start": 205.091,
              "end": 205.291,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 205.331,
              "end": 205.371,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 205.411,
              "end": 205.491,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Empire",
              "start": 205.551,
              "end": 205.951,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 206.011,
              "end": 206.111,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 206.172,
              "end": 206.252,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "other.",
              "start": 206.372,
              "end": 206.592,
              "score": 0.551,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 31,
      "seek": 173.23,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 206.932,
      "end": 222.484,
      "text": "The problem is that there's only one planet in the known universe that has it, the desert world of Arrakis, a scorched wasteland which is so hot and barren that the only humans who can survive there are the nomadic Freeman who use specially designed suits to recycle their body water.",
      "words": [
          {
              "word": "The",
              "start": 206.932,
              "end": 207.012,
              "score": 0.979,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "problem",
              "start": 207.052,
              "end": 207.412,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 207.493,
              "end": 207.573,
              "score": 0.714,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 207.613,
              "end": 207.713,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "there's",
              "start": 207.733,
              "end": 207.933,
              "score": 0.781,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "only",
              "start": 207.973,
              "end": 208.173,
              "score": 0.775,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one",
              "start": 208.293,
              "end": 208.393,
              "score": 0.795,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "planet",
              "start": 208.453,
              "end": 208.793,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 208.833,
              "end": 208.914,
              "score": 0.829,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 208.954,
              "end": 209.034,
              "score": 0.945,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "known",
              "start": 209.094,
              "end": 209.314,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "universe",
              "start": 209.394,
              "end": 209.794,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 209.814,
              "end": 209.954,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "has",
              "start": 209.994,
              "end": 210.235,
              "score": 0.949,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it,",
              "start": 210.355,
              "end": 210.435,
              "score": 0.778,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 210.735,
              "end": 210.835,
              "score": 0.823,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "desert",
              "start": 210.915,
              "end": 211.255,
              "score": 0.841,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world",
              "start": 211.295,
              "end": 211.596,
              "score": 0.79,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 211.636,
              "end": 211.696,
              "score": 0.752,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Arrakis,",
              "start": 211.776,
              "end": 212.496,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 212.796,
              "end": 212.856,
              "score": 0.81,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "scorched",
              "start": 212.916,
              "end": 213.277,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wasteland",
              "start": 213.337,
              "end": 213.937,
              "score": 0.744,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 214.037,
              "end": 214.177,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 214.257,
              "end": 214.318,
              "score": 0.96,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so",
              "start": 214.378,
              "end": 214.558,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hot",
              "start": 214.638,
              "end": 214.858,
              "score": 0.936,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 214.918,
              "end": 214.998,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "barren",
              "start": 215.098,
              "end": 215.478,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 215.719,
              "end": 215.839,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 215.879,
              "end": 215.959,
              "score": 0.872,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "only",
              "start": 216.019,
              "end": 216.199,
              "score": 0.737,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "humans",
              "start": 216.239,
              "end": 216.579,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 216.639,
              "end": 216.739,
              "score": 0.991,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 216.779,
              "end": 216.899,
              "score": 0.891,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "survive",
              "start": 216.939,
              "end": 217.36,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "there",
              "start": 217.4,
              "end": 217.6,
              "score": 0.684,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "are",
              "start": 217.68,
              "end": 217.78,
              "score": 0.67,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 217.82,
              "end": 217.9,
              "score": 0.962,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "nomadic",
              "start": 217.96,
              "end": 218.421,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Freeman",
              "start": 218.541,
              "end": 218.981,
              "score": 0.725,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 219.181,
              "end": 219.301,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "use",
              "start": 219.381,
              "end": 219.501,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "specially",
              "start": 219.561,
              "end": 219.982,
              "score": 0.94,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "designed",
              "start": 220.042,
              "end": 220.382,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "suits",
              "start": 220.462,
              "end": 220.742,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 220.802,
              "end": 220.902,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "recycle",
              "start": 220.942,
              "end": 221.483,
              "score": 0.924,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "their",
              "start": 221.523,
              "end": 221.663,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "body",
              "start": 221.683,
              "end": 221.963,
              "score": 0.993,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "water.",
              "start": 222.003,
              "end": 222.484,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 32,
      "seek": 206.932,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 222.724,
      "end": 226.787,
      "text": "You literally have to drink your own sweat and piss to stay alive on Arrakis.",
      "words": [
          {
              "word": "You",
              "start": 222.724,
              "end": 222.864,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "literally",
              "start": 222.924,
              "end": 223.384,
              "score": 0.737,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 223.424,
              "end": 223.564,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 223.604,
              "end": 223.684,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "drink",
              "start": 223.764,
              "end": 224.045,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "your",
              "start": 224.085,
              "end": 224.225,
              "score": 0.789,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "own",
              "start": 224.265,
              "end": 224.385,
              "score": 0.878,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sweat",
              "start": 224.505,
              "end": 224.785,
              "score": 0.973,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 224.825,
              "end": 224.925,
              "score": 0.672,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "piss",
              "start": 225.045,
              "end": 225.306,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 225.346,
              "end": 225.446,
              "score": 0.988,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stay",
              "start": 225.506,
              "end": 225.726,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "alive",
              "start": 225.766,
              "end": 226.046,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 226.106,
              "end": 226.166,
              "score": 0.986,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Arrakis.",
              "start": 226.226,
              "end": 226.787,
              "score": 0.904,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 33,
      "seek": 206.932,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 230.393,
      "end": 233.356,
      "text": " I mean to be honest, it's better than Buckfast, so what the hell?",
      "words": [
          {
              "word": "I",
              "start": 230.393,
              "end": 230.433,
              "score": 0.981,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mean",
              "start": 230.473,
              "end": 230.613,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 230.653,
              "end": 230.713,
              "score": 0.715,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 230.753,
              "end": 230.814,
              "score": 0.978,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "honest,",
              "start": 230.854,
              "end": 231.174,
              "score": 0.916,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 231.254,
              "end": 231.334,
              "score": 0.496,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "better",
              "start": 231.394,
              "end": 231.634,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "than",
              "start": 231.674,
              "end": 231.815,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Buckfast,",
              "start": 231.875,
              "end": 232.575,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so",
              "start": 232.615,
              "end": 232.736,
              "score": 0.784,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "what",
              "start": 232.756,
              "end": 232.876,
              "score": 0.594,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 232.916,
              "end": 233.016,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hell?",
              "start": 233.056,
              "end": 233.356,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 34,
      "seek": 206.932,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 233.717,
      "end": 241.485,
      "text": "Anyway, needless to say, whoever controls Arrakis holds the balance of power in the galaxy, so pretty much everyone wants to get their hands on it.",
      "words": [
          {
              "word": "Anyway,",
              "start": 233.717,
              "end": 234.017,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "needless",
              "start": 234.137,
              "end": 234.478,
              "score": 0.843,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 234.518,
              "end": 234.618,
              "score": 0.754,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "say,",
              "start": 234.678,
              "end": 234.918,
              "score": 0.719,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "whoever",
              "start": 235.058,
              "end": 235.419,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "controls",
              "start": 235.479,
              "end": 235.879,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Arrakis",
              "start": 235.959,
              "end": 236.44,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "holds",
              "start": 236.6,
              "end": 236.88,
              "score": 0.734,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 236.94,
              "end": 237.02,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "balance",
              "start": 237.06,
              "end": 237.421,
              "score": 0.837,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 237.461,
              "end": 237.521,
              "score": 0.749,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "power",
              "start": 237.581,
              "end": 237.901,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 237.941,
              "end": 238.021,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 238.061,
              "end": 238.121,
              "score": 0.993,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "galaxy,",
              "start": 238.162,
              "end": 238.762,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so",
              "start": 239.022,
              "end": 239.183,
              "score": 0.954,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 239.223,
              "end": 239.443,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 239.463,
              "end": 239.663,
              "score": 0.907,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "everyone",
              "start": 239.763,
              "end": 240.124,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wants",
              "start": 240.164,
              "end": 240.364,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 240.404,
              "end": 240.464,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 240.504,
              "end": 240.624,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "their",
              "start": 240.664,
              "end": 240.804,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hands",
              "start": 240.824,
              "end": 241.065,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 241.185,
              "end": 241.265,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it.",
              "start": 241.345,
              "end": 241.485,
              "score": 0.79,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 35,
      "seek": 233.717,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 241.846,
      "end": 251.216,
      "text": "Hmm, corrupt imperial powers, fighting over a desolate desert wasteland that's rich in natural resources, I wonder if this could be applied to our modern world.",
      "words": [
          {
              "word": "Hmm,",
              "start": 241.846,
              "end": 242.106,
              "score": 0.741,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "corrupt",
              "start": 242.426,
              "end": 242.847,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "imperial",
              "start": 242.907,
              "end": 243.387,
              "score": 0.958,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "powers,",
              "start": 243.487,
              "end": 243.888,
              "score": 0.823,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fighting",
              "start": 244.028,
              "end": 244.408,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "over",
              "start": 244.488,
              "end": 244.689,
              "score": 0.789,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 244.749,
              "end": 244.769,
              "score": 0.991,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "desolate",
              "start": 244.849,
              "end": 245.389,
              "score": 0.762,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "desert",
              "start": 245.449,
              "end": 245.85,
              "score": 0.805,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wasteland",
              "start": 245.91,
              "end": 246.39,
              "score": 0.882,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that's",
              "start": 246.431,
              "end": 246.591,
              "score": 0.497,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "rich",
              "start": 246.691,
              "end": 246.911,
              "score": 0.812,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 246.971,
              "end": 247.051,
              "score": 0.297,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "natural",
              "start": 247.111,
              "end": 247.552,
              "score": 0.814,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "resources,",
              "start": 247.632,
              "end": 248.373,
              "score": 0.828,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 248.713,
              "end": 248.773,
              "score": 0.988,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wonder",
              "start": 248.813,
              "end": 249.073,
              "score": 0.753,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "if",
              "start": 249.113,
              "end": 249.173,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 249.234,
              "end": 249.374,
              "score": 0.918,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 249.434,
              "end": 249.594,
              "score": 0.912,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 249.634,
              "end": 249.734,
              "score": 0.83,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "applied",
              "start": 249.774,
              "end": 250.115,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 250.175,
              "end": 250.275,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "our",
              "start": 250.335,
              "end": 250.435,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "modern",
              "start": 250.495,
              "end": 250.835,
              "score": 0.789,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world.",
              "start": 250.895,
              "end": 251.216,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 36,
      "seek": 233.717,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 251.576,
      "end": 265.002,
      "text": " The story picks up with house or treaties, who have been given the task of running Arrakis and keeping spice production going, but it's not long before a rival house makes a move against them, wiping out most of the royal family and taking control of Arrakis for themselves.",
      "words": [
          {
              "word": "The",
              "start": 251.576,
              "end": 251.676,
              "score": 0.991,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "story",
              "start": 251.716,
              "end": 252.016,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "picks",
              "start": 252.076,
              "end": 252.316,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "up",
              "start": 252.396,
              "end": 252.496,
              "score": 0.673,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 252.536,
              "end": 252.697,
              "score": 0.576,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "house",
              "start": 252.737,
              "end": 252.957,
              "score": 0.94,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "or",
              "start": 253.057,
              "end": 253.117,
              "score": 0.641,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "treaties,",
              "start": 253.157,
              "end": 253.597,
              "score": 0.778,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 253.777,
              "end": 253.857,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 253.877,
              "end": 253.997,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "been",
              "start": 254.017,
              "end": 254.157,
              "score": 0.974,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "given",
              "start": 254.197,
              "end": 254.437,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 254.477,
              "end": 254.577,
              "score": 0.733,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "task",
              "start": 254.617,
              "end": 254.937,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 254.977,
              "end": 255.057,
              "score": 0.666,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "running",
              "start": 255.118,
              "end": 255.378,
              "score": 0.908,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Arrakis",
              "start": 255.438,
              "end": 255.938,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 256.038,
              "end": 256.118,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "keeping",
              "start": 256.158,
              "end": 256.478,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "spice",
              "start": 256.518,
              "end": 256.838,
              "score": 0.937,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "production",
              "start": 256.878,
              "end": 257.378,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "going,",
              "start": 257.418,
              "end": 257.759,
              "score": 0.775,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 257.959,
              "end": 258.059,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 258.079,
              "end": 258.199,
              "score": 0.788,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "not",
              "start": 258.219,
              "end": 258.359,
              "score": 0.585,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "long",
              "start": 258.399,
              "end": 258.579,
              "score": 0.772,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "before",
              "start": 258.619,
              "end": 258.899,
              "score": 0.716,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 258.939,
              "end": 258.959,
              "score": 0.998,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "rival",
              "start": 259.039,
              "end": 259.339,
              "score": 0.924,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "house",
              "start": 259.379,
              "end": 259.599,
              "score": 0.802,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "makes",
              "start": 259.659,
              "end": 259.859,
              "score": 0.779,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 259.899,
              "end": 259.919,
              "score": 0.995,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "move",
              "start": 259.98,
              "end": 260.16,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "against",
              "start": 260.2,
              "end": 260.5,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "them,",
              "start": 260.58,
              "end": 260.72,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wiping",
              "start": 260.94,
              "end": 261.24,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 261.3,
              "end": 261.4,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "most",
              "start": 261.44,
              "end": 261.64,
              "score": 0.715,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 261.68,
              "end": 261.74,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 261.78,
              "end": 261.84,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "royal",
              "start": 261.9,
              "end": 262.14,
              "score": 0.863,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "family",
              "start": 262.2,
              "end": 262.601,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 262.701,
              "end": 262.781,
              "score": 0.901,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "taking",
              "start": 262.821,
              "end": 263.121,
              "score": 0.875,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "control",
              "start": 263.161,
              "end": 263.521,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 263.541,
              "end": 263.581,
              "score": 0.57,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Arrakis",
              "start": 263.641,
              "end": 264.081,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 264.121,
              "end": 264.241,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "themselves.",
              "start": 264.261,
              "end": 265.002,
              "score": 0.756,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 37,
      "seek": 233.717,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 265.362,
      "end": 273.005,
      "text": "One of the few survivors is Paul, the son of the house, who eventually hooks up with a band of Freeman and leads a rebellion to retake the planets.",
      "words": [
          {
              "word": "One",
              "start": 265.362,
              "end": 265.442,
              "score": 0.936,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 265.482,
              "end": 265.542,
              "score": 0.764,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 265.582,
              "end": 265.662,
              "score": 0.828,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "few",
              "start": 265.702,
              "end": 265.882,
              "score": 0.998,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "survivors",
              "start": 265.922,
              "end": 266.522,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 266.622,
              "end": 266.682,
              "score": 0.97,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Paul,",
              "start": 266.822,
              "end": 267.202,
              "score": 0.882,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 267.363,
              "end": 267.463,
              "score": 0.96,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "son",
              "start": 267.523,
              "end": 267.723,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 267.763,
              "end": 267.823,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 267.863,
              "end": 267.963,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "house,",
              "start": 268.023,
              "end": 268.303,
              "score": 0.933,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 268.483,
              "end": 268.563,
              "score": 0.955,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "eventually",
              "start": 268.623,
              "end": 269.043,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hooks",
              "start": 269.083,
              "end": 269.323,
              "score": 0.759,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "up",
              "start": 269.383,
              "end": 269.463,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 269.503,
              "end": 269.623,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 269.664,
              "end": 269.684,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "band",
              "start": 269.744,
              "end": 269.984,
              "score": 0.934,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 270.044,
              "end": 270.104,
              "score": 0.772,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Freeman",
              "start": 270.164,
              "end": 270.544,
              "score": 0.719,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 270.804,
              "end": 270.904,
              "score": 0.676,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "leads",
              "start": 270.944,
              "end": 271.144,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 271.184,
              "end": 271.224,
              "score": 0.737,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "rebellion",
              "start": 271.284,
              "end": 271.784,
              "score": 0.828,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 271.824,
              "end": 271.924,
              "score": 0.724,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "retake",
              "start": 271.984,
              "end": 272.345,
              "score": 0.977,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 272.385,
              "end": 272.465,
              "score": 0.809,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "planets.",
              "start": 272.525,
              "end": 273.005,
              "score": 0.894,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 38,
      "seek": 265.362,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 273.345,
      "end": 288.535,
      "text": " Dune is a classic hero's journey about a chosen one, torn from his safe, comfortable upbringing, put through various trials and hardships that mold him into a stronger and better man, and ultimately returning to lead his people to freedom and conquer the evil enemy who first defeated him.",
      "words": [
          {
              "word": "Dune",
              "start": 273.345,
              "end": 273.665,
              "score": 0.774,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 273.725,
              "end": 273.805,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 273.865,
              "end": 273.905,
              "score": 0.523,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "classic",
              "start": 273.945,
              "end": 274.386,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hero's",
              "start": 274.446,
              "end": 274.826,
              "score": 0.742,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "journey",
              "start": 274.886,
              "end": 275.266,
              "score": 0.919,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 275.386,
              "end": 275.586,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 275.626,
              "end": 275.666,
              "score": 0.496,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "chosen",
              "start": 275.787,
              "end": 276.167,
              "score": 0.892,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one,",
              "start": 276.327,
              "end": 276.447,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "torn",
              "start": 276.567,
              "end": 276.807,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "from",
              "start": 276.887,
              "end": 277.027,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 277.067,
              "end": 277.187,
              "score": 0.756,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "safe,",
              "start": 277.308,
              "end": 277.568,
              "score": 0.913,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "comfortable",
              "start": 277.688,
              "end": 278.168,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "upbringing,",
              "start": 278.268,
              "end": 278.708,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "put",
              "start": 278.989,
              "end": 279.149,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "through",
              "start": 279.189,
              "end": 279.389,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "various",
              "start": 279.429,
              "end": 279.809,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "trials",
              "start": 279.889,
              "end": 280.249,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 280.309,
              "end": 280.389,
              "score": 0.975,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hardships",
              "start": 280.449,
              "end": 280.93,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 281.01,
              "end": 281.13,
              "score": 0.931,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mold",
              "start": 281.19,
              "end": 281.41,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him",
              "start": 281.45,
              "end": 281.53,
              "score": 0.852,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "into",
              "start": 281.57,
              "end": 281.77,
              "score": 0.83,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 281.81,
              "end": 281.83,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stronger",
              "start": 281.91,
              "end": 282.371,
              "score": 0.891,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 282.431,
              "end": 282.531,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "better",
              "start": 282.571,
              "end": 282.911,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "man,",
              "start": 282.971,
              "end": 283.251,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 283.451,
              "end": 283.531,
              "score": 0.967,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ultimately",
              "start": 283.591,
              "end": 284.052,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "returning",
              "start": 284.112,
              "end": 284.572,
              "score": 0.921,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 284.632,
              "end": 284.752,
              "score": 0.837,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "lead",
              "start": 284.792,
              "end": 284.932,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 284.952,
              "end": 285.052,
              "score": 0.782,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "people",
              "start": 285.112,
              "end": 285.393,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 285.433,
              "end": 285.533,
              "score": 0.978,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "freedom",
              "start": 285.593,
              "end": 285.953,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 286.073,
              "end": 286.173,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "conquer",
              "start": 286.253,
              "end": 286.613,
              "score": 0.841,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 286.633,
              "end": 286.733,
              "score": 0.779,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "evil",
              "start": 286.853,
              "end": 287.054,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "enemy",
              "start": 287.134,
              "end": 287.394,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 287.434,
              "end": 287.574,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "first",
              "start": 287.614,
              "end": 287.834,
              "score": 0.858,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "defeated",
              "start": 287.854,
              "end": 288.334,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him.",
              "start": 288.374,
              "end": 288.535,
              "score": 0.779,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 39,
      "seek": 265.362,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 288.815,
      "end": 293.878,
      "text": "And in the process, fulfilling his destiny to become the messianic figure that was prophesized.",
      "words": [
          {
              "word": "And",
              "start": 288.815,
              "end": 288.895,
              "score": 0.98,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 288.935,
              "end": 288.995,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 289.035,
              "end": 289.115,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "process,",
              "start": 289.155,
              "end": 289.635,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fulfilling",
              "start": 289.795,
              "end": 290.276,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 290.316,
              "end": 290.436,
              "score": 0.675,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "destiny",
              "start": 290.476,
              "end": 290.936,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 290.976,
              "end": 291.076,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "become",
              "start": 291.116,
              "end": 291.436,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 291.476,
              "end": 291.556,
              "score": 0.947,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "messianic",
              "start": 291.616,
              "end": 292.217,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "figure",
              "start": 292.297,
              "end": 292.577,
              "score": 0.789,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 292.637,
              "end": 292.777,
              "score": 0.643,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 292.797,
              "end": 292.897,
              "score": 0.892,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "prophesized.",
              "start": 293.037,
              "end": 293.878,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 40,
      "seek": 265.362,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 294.198,
      "end": 303.621,
      "text": " The story of June might be relatively simple and classic, but the world of June is much more subtle and complex, and I think this is where the David Lynch movie fell apart.",
      "words": [
          {
              "word": "The",
              "start": 294.198,
              "end": 294.318,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "story",
              "start": 294.358,
              "end": 294.758,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 294.798,
              "end": 294.838,
              "score": 1.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "June",
              "start": 294.918,
              "end": 295.238,
              "score": 0.785,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "might",
              "start": 295.318,
              "end": 295.498,
              "score": 0.823,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 295.538,
              "end": 295.638,
              "score": 0.829,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "relatively",
              "start": 295.698,
              "end": 296.219,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "simple",
              "start": 296.299,
              "end": 296.639,
              "score": 0.795,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 296.679,
              "end": 296.779,
              "score": 0.763,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "classic,",
              "start": 296.819,
              "end": 297.319,
              "score": 0.92,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 297.599,
              "end": 297.719,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 297.759,
              "end": 297.859,
              "score": 0.829,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world",
              "start": 297.939,
              "end": 298.299,
              "score": 0.79,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 298.339,
              "end": 298.399,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "June",
              "start": 298.479,
              "end": 298.759,
              "score": 0.779,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 298.859,
              "end": 298.939,
              "score": 0.643,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 299.06,
              "end": 299.26,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "more",
              "start": 299.32,
              "end": 299.48,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "subtle",
              "start": 299.6,
              "end": 299.96,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 300.0,
              "end": 300.1,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "complex,",
              "start": 300.14,
              "end": 300.74,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 300.92,
              "end": 301.02,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 301.04,
              "end": 301.08,
              "score": 0.5,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 301.12,
              "end": 301.28,
              "score": 0.848,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 301.32,
              "end": 301.44,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 301.52,
              "end": 301.58,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "where",
              "start": 301.62,
              "end": 301.78,
              "score": 0.92,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 301.8,
              "end": 301.9,
              "score": 0.608,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "David",
              "start": 301.94,
              "end": 302.22,
              "score": 0.931,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Lynch",
              "start": 302.26,
              "end": 302.501,
              "score": 0.71,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 302.561,
              "end": 302.841,
              "score": 0.756,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fell",
              "start": 302.881,
              "end": 303.141,
              "score": 0.944,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "apart.",
              "start": 303.161,
              "end": 303.621,
              "score": 0.711,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 41,
      "seek": 294.198,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 303.841,
      "end": 313.384,
      "text": "There just wasn't enough time to properly explore everything and flesh out such a fantastical world, but Villeneuve on the other hand has got more time to play with and less ground to cover.",
      "words": [
          {
              "word": "There",
              "start": 303.841,
              "end": 303.981,
              "score": 0.875,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "just",
              "start": 304.021,
              "end": 304.141,
              "score": 0.956,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wasn't",
              "start": 304.181,
              "end": 304.481,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "enough",
              "start": 304.541,
              "end": 304.741,
              "score": 0.925,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "time",
              "start": 304.821,
              "end": 305.061,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 305.121,
              "end": 305.221,
              "score": 0.47,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "properly",
              "start": 305.261,
              "end": 305.662,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "explore",
              "start": 305.722,
              "end": 306.182,
              "score": 0.918,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "everything",
              "start": 306.242,
              "end": 306.642,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 306.882,
              "end": 306.982,
              "score": 0.813,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "flesh",
              "start": 307.042,
              "end": 307.342,
              "score": 0.785,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 307.422,
              "end": 307.542,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "such",
              "start": 307.622,
              "end": 307.842,
              "score": 0.913,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 307.882,
              "end": 307.922,
              "score": 0.483,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fantastical",
              "start": 307.962,
              "end": 308.662,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world,",
              "start": 308.722,
              "end": 309.103,
              "score": 0.761,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 309.223,
              "end": 309.343,
              "score": 0.843,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Villeneuve",
              "start": 309.383,
              "end": 309.843,
              "score": 0.717,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 309.883,
              "end": 309.943,
              "score": 0.978,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 309.983,
              "end": 310.063,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "other",
              "start": 310.103,
              "end": 310.263,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hand",
              "start": 310.303,
              "end": 310.503,
              "score": 0.792,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "has",
              "start": 310.563,
              "end": 310.703,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 310.743,
              "end": 310.903,
              "score": 0.805,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "more",
              "start": 310.923,
              "end": 311.103,
              "score": 0.677,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "time",
              "start": 311.143,
              "end": 311.363,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 311.403,
              "end": 311.503,
              "score": 0.594,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "play",
              "start": 311.563,
              "end": 311.763,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 311.803,
              "end": 311.943,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 312.104,
              "end": 312.244,
              "score": 0.746,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "less",
              "start": 312.324,
              "end": 312.524,
              "score": 0.988,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ground",
              "start": 312.584,
              "end": 312.864,
              "score": 0.869,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 312.904,
              "end": 312.984,
              "score": 0.757,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cover.",
              "start": 313.044,
              "end": 313.384,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 42,
      "seek": 294.198,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 313.624,
      "end": 322.947,
      "text": "Apparently his film's only going to deal with the first half of the first book, which I think is a smart decision, because it allows him the time and space needed to get his audience invested in the world.",
      "words": [
          {
              "word": "Apparently",
              "start": 313.624,
              "end": 314.044,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 314.064,
              "end": 314.244,
              "score": 0.695,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "film's",
              "start": 314.304,
              "end": 314.584,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "only",
              "start": 314.644,
              "end": 314.824,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "going",
              "start": 314.844,
              "end": 314.984,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 315.004,
              "end": 315.064,
              "score": 0.756,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "deal",
              "start": 315.104,
              "end": 315.285,
              "score": 0.712,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 315.325,
              "end": 315.445,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 315.485,
              "end": 315.565,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "first",
              "start": 315.625,
              "end": 315.885,
              "score": 0.731,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "half",
              "start": 315.925,
              "end": 316.165,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 316.205,
              "end": 316.265,
              "score": 0.749,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 316.305,
              "end": 316.385,
              "score": 0.941,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "first",
              "start": 316.425,
              "end": 316.665,
              "score": 0.895,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "book,",
              "start": 316.765,
              "end": 317.045,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 317.225,
              "end": 317.365,
              "score": 0.952,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 317.425,
              "end": 317.465,
              "score": 0.769,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 317.485,
              "end": 317.645,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 317.705,
              "end": 317.805,
              "score": 0.658,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 317.845,
              "end": 317.885,
              "score": 0.566,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "smart",
              "start": 317.925,
              "end": 318.185,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "decision,",
              "start": 318.225,
              "end": 318.686,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "because",
              "start": 318.846,
              "end": 319.086,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 319.126,
              "end": 319.166,
              "score": 0.767,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "allows",
              "start": 319.206,
              "end": 319.506,
              "score": 0.926,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him",
              "start": 319.546,
              "end": 319.686,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 319.746,
              "end": 319.846,
              "score": 0.744,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "time",
              "start": 319.886,
              "end": 320.086,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 320.146,
              "end": 320.206,
              "score": 0.96,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "space",
              "start": 320.266,
              "end": 320.606,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "needed",
              "start": 320.666,
              "end": 320.926,
              "score": 0.858,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 320.946,
              "end": 321.006,
              "score": 0.734,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 321.046,
              "end": 321.166,
              "score": 0.982,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 321.206,
              "end": 321.306,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "audience",
              "start": 321.366,
              "end": 321.746,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "invested",
              "start": 321.807,
              "end": 322.307,
              "score": 0.857,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 322.367,
              "end": 322.427,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 322.467,
              "end": 322.547,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "world.",
              "start": 322.587,
              "end": 322.947,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 43,
      "seek": 294.198,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 323.507,
      "end": 327.05,
      "text": " Based on what I've seen in the trailers, the movie looks visually stunning.",
      "words": [
          {
              "word": "Based",
              "start": 323.507,
              "end": 323.707,
              "score": 0.647,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 323.767,
              "end": 323.827,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "what",
              "start": 323.847,
              "end": 323.967,
              "score": 0.368,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 323.987,
              "end": 324.108,
              "score": 0.46,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "seen",
              "start": 324.128,
              "end": 324.308,
              "score": 0.943,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 324.348,
              "end": 324.408,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 324.448,
              "end": 324.528,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "trailers,",
              "start": 324.568,
              "end": 324.988,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 325.269,
              "end": 325.349,
              "score": 0.953,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 325.389,
              "end": 325.649,
              "score": 0.726,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "looks",
              "start": 325.669,
              "end": 325.889,
              "score": 0.491,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "visually",
              "start": 325.969,
              "end": 326.45,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stunning.",
              "start": 326.53,
              "end": 327.05,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 44,
      "seek": 294.198,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 327.31,
      "end": 341.142,
      "text": "Clearly today's special effects technology can do things that directors back in the 80s could never have dreamed of, whether it's gigantic city-sized spaceships, vast armies and cities, towering splice harvesters and monstrous sandworms.",
      "words": [
          {
              "word": "Clearly",
              "start": 327.31,
              "end": 327.671,
              "score": 0.957,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "today's",
              "start": 327.731,
              "end": 328.091,
              "score": 0.608,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "special",
              "start": 328.131,
              "end": 328.531,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "effects",
              "start": 328.571,
              "end": 328.912,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "technology",
              "start": 328.952,
              "end": 329.592,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 329.632,
              "end": 329.772,
              "score": 0.975,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "do",
              "start": 329.812,
              "end": 329.952,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "things",
              "start": 330.013,
              "end": 330.273,
              "score": 0.67,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 330.313,
              "end": 330.453,
              "score": 0.922,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "directors",
              "start": 330.493,
              "end": 330.993,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "back",
              "start": 331.053,
              "end": 331.274,
              "score": 0.962,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 331.314,
              "end": 331.394,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 331.414,
              "end": 331.494,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "80s",
              "start": 331.794,
              "end": 331.854,
              "score": 0.364,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 331.894,
              "end": 332.054,
              "score": 0.805,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "never",
              "start": 332.114,
              "end": 332.334,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 332.374,
              "end": 332.495,
              "score": 0.912,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "dreamed",
              "start": 332.535,
              "end": 332.815,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of,",
              "start": 332.975,
              "end": 333.075,
              "score": 0.872,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "whether",
              "start": 333.295,
              "end": 333.555,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 333.595,
              "end": 333.696,
              "score": 0.512,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gigantic",
              "start": 333.756,
              "end": 334.376,
              "score": 0.921,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "city-sized",
              "start": 334.476,
              "end": 335.077,
              "score": 0.816,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "spaceships,",
              "start": 335.137,
              "end": 335.777,
              "score": 0.767,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "vast",
              "start": 336.017,
              "end": 336.358,
              "score": 0.894,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "armies",
              "start": 336.478,
              "end": 336.798,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 336.838,
              "end": 336.958,
              "score": 0.785,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cities,",
              "start": 337.078,
              "end": 337.539,
              "score": 0.853,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "towering",
              "start": 337.799,
              "end": 338.279,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "splice",
              "start": 338.339,
              "end": 338.74,
              "score": 0.918,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "harvesters",
              "start": 338.78,
              "end": 339.4,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 339.661,
              "end": 339.761,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "monstrous",
              "start": 339.841,
              "end": 340.321,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sandworms.",
              "start": 340.401,
              "end": 341.142,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 45,
      "seek": 327.31,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 341.522,
      "end": 349.031,
      "text": " It all looked big and imposing and futuristic, but also grounded and functional, which is exactly how it was described in the books.",
      "words": [
          {
              "word": "It",
              "start": 341.522,
              "end": 341.582,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 341.622,
              "end": 341.742,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "looked",
              "start": 341.762,
              "end": 341.983,
              "score": 0.616,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "big",
              "start": 342.143,
              "end": 342.443,
              "score": 0.966,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 342.483,
              "end": 342.563,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "imposing",
              "start": 342.623,
              "end": 343.244,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 343.284,
              "end": 343.364,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "futuristic,",
              "start": 343.444,
              "end": 344.285,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 344.465,
              "end": 344.566,
              "score": 0.901,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "also",
              "start": 344.646,
              "end": 344.966,
              "score": 0.892,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "grounded",
              "start": 345.126,
              "end": 345.587,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 345.627,
              "end": 345.707,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "functional,",
              "start": 345.827,
              "end": 346.408,
              "score": 0.803,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 346.668,
              "end": 346.808,
              "score": 0.92,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 346.888,
              "end": 346.948,
              "score": 0.944,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "exactly",
              "start": 347.008,
              "end": 347.449,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "how",
              "start": 347.489,
              "end": 347.609,
              "score": 0.805,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 347.669,
              "end": 347.729,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 347.769,
              "end": 347.849,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "described",
              "start": 347.889,
              "end": 348.35,
              "score": 0.907,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 348.39,
              "end": 348.45,
              "score": 0.772,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 348.49,
              "end": 348.57,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "books.",
              "start": 348.63,
              "end": 349.031,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 46,
      "seek": 327.31,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 349.371,
      "end": 355.958,
      "text": "Even things like the personal force feels used for hand-to-hand combat behave like real technology that could one day exist.",
      "words": [
          {
              "word": "Even",
              "start": 349.371,
              "end": 349.531,
              "score": 0.976,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "things",
              "start": 349.611,
              "end": 349.831,
              "score": 0.858,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 349.872,
              "end": 350.032,
              "score": 0.675,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 350.052,
              "end": 350.132,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "personal",
              "start": 350.172,
              "end": 350.592,
              "score": 0.813,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "force",
              "start": 350.672,
              "end": 350.933,
              "score": 0.897,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "feels",
              "start": 350.973,
              "end": 351.273,
              "score": 0.667,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "used",
              "start": 351.373,
              "end": 351.513,
              "score": 0.843,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 351.553,
              "end": 351.674,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hand-to-hand",
              "start": 351.714,
              "end": 352.234,
              "score": 0.739,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "combat",
              "start": 352.314,
              "end": 352.835,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "behave",
              "start": 353.095,
              "end": 353.436,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 353.476,
              "end": 353.656,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "real",
              "start": 353.736,
              "end": 353.976,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "technology",
              "start": 354.036,
              "end": 354.677,
              "score": 0.943,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 354.717,
              "end": 354.837,
              "score": 0.746,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 354.877,
              "end": 355.017,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one",
              "start": 355.138,
              "end": 355.258,
              "score": 0.766,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "day",
              "start": 355.298,
              "end": 355.478,
              "score": 0.663,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "exist.",
              "start": 355.558,
              "end": 355.958,
              "score": 0.785,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 47,
      "seek": 327.31,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 356.519,
      "end": 368.047,
      "text": " Villeneuve's work on Blade Runner 2049 proved that the guy can produce visually striking movies, even if his editing could use a dose of get a fucking move on every once in a while, so I've got no worries on that score.",
      "words": [
          {
              "word": "Villeneuve's",
              "start": 356.519,
              "end": 357.039,
              "score": 0.676,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "work",
              "start": 357.079,
              "end": 357.32,
              "score": 0.919,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 357.4,
              "end": 357.48,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Blade",
              "start": 357.54,
              "end": 358.38,
              "score": 0.702,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Runner",
              "start": 358.56,
              "end": 359.021,
              "score": 0.582,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "2049"
          },
          {
              "word": "proved",
              "start": 359.201,
              "end": 359.421,
              "score": 0.765,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 359.461,
              "end": 359.561,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 359.601,
              "end": 359.661,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guy",
              "start": 359.701,
              "end": 359.881,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 359.901,
              "end": 360.041,
              "score": 0.967,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "produce",
              "start": 360.101,
              "end": 360.442,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "visually",
              "start": 360.502,
              "end": 360.882,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "striking",
              "start": 360.942,
              "end": 361.362,
              "score": 0.945,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movies,",
              "start": 361.422,
              "end": 361.803,
              "score": 0.837,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "even",
              "start": 362.003,
              "end": 362.163,
              "score": 0.807,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "if",
              "start": 362.223,
              "end": 362.283,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 362.323,
              "end": 362.443,
              "score": 0.796,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "editing",
              "start": 362.503,
              "end": 362.863,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 362.883,
              "end": 363.064,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "use",
              "start": 363.144,
              "end": 363.284,
              "score": 0.913,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 363.324,
              "end": 363.364,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "dose",
              "start": 363.404,
              "end": 363.664,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 363.704,
              "end": 363.784,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 363.964,
              "end": 364.164,
              "score": 0.802,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 364.224,
              "end": 364.244,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fucking",
              "start": 364.324,
              "end": 364.685,
              "score": 0.773,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "move",
              "start": 364.745,
              "end": 364.985,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 365.065,
              "end": 365.185,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "every",
              "start": 365.245,
              "end": 365.445,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "once",
              "start": 365.505,
              "end": 365.685,
              "score": 0.812,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 365.725,
              "end": 365.805,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 365.845,
              "end": 365.885,
              "score": 0.773,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "while,",
              "start": 365.925,
              "end": 366.186,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "so",
              "start": 366.426,
              "end": 366.526,
              "score": 0.97,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 366.566,
              "end": 366.686,
              "score": 0.795,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 366.706,
              "end": 366.826,
              "score": 0.797,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "no",
              "start": 366.866,
              "end": 366.966,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "worries",
              "start": 367.006,
              "end": 367.286,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 367.366,
              "end": 367.427,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 367.467,
              "end": 367.627,
              "score": 0.956,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "score.",
              "start": 367.687,
              "end": 368.047,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 48,
      "seek": 356.519,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 368.407,
      "end": 379.575,
      "text": "The casting generally looks good, and talk about an ensemble movie, you've got Josh Brolin, Oscar Isaac, Stellan Skarsgard, Havier Bardem and Rebecca Ferguson all in one film.",
      "words": [
          {
              "word": "The",
              "start": 368.407,
              "end": 368.487,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "casting",
              "start": 368.507,
              "end": 368.928,
              "score": 0.782,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "generally",
              "start": 368.968,
              "end": 369.328,
              "score": 0.882,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "looks",
              "start": 369.388,
              "end": 369.588,
              "score": 0.916,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "good,",
              "start": 369.648,
              "end": 369.948,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 370.168,
              "end": 370.268,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "talk",
              "start": 370.308,
              "end": 370.509,
              "score": 0.988,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 370.549,
              "end": 370.749,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "an",
              "start": 370.789,
              "end": 370.849,
              "score": 0.771,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ensemble",
              "start": 370.929,
              "end": 371.569,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie,",
              "start": 371.629,
              "end": 372.01,
              "score": 0.724,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you've",
              "start": 372.23,
              "end": 372.41,
              "score": 0.764,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 372.43,
              "end": 372.57,
              "score": 0.691,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Josh",
              "start": 372.65,
              "end": 372.97,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Brolin,",
              "start": 373.03,
              "end": 373.491,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Oscar",
              "start": 373.731,
              "end": 374.111,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Isaac,",
              "start": 374.251,
              "end": 374.611,
              "score": 0.858,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Stellan",
              "start": 374.912,
              "end": 375.312,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Skarsgard,",
              "start": 375.372,
              "end": 376.112,
              "score": 0.776,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Havier",
              "start": 376.293,
              "end": 376.693,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Bardem",
              "start": 376.753,
              "end": 377.253,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 377.433,
              "end": 377.553,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Rebecca",
              "start": 377.613,
              "end": 378.054,
              "score": 0.898,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Ferguson",
              "start": 378.094,
              "end": 378.614,
              "score": 0.777,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 378.674,
              "end": 378.814,
              "score": 0.782,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 378.854,
              "end": 378.934,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one",
              "start": 379.034,
              "end": 379.175,
              "score": 0.722,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "film.",
              "start": 379.295,
              "end": 379.575,
              "score": 0.922,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 49,
      "seek": 356.519,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 379.975,
      "end": 383.558,
      "text": " Timothy Shalamey looks suitably fresh-faced and innocent as Paul.",
      "words": [
          {
              "word": "Timothy",
              "start": 379.975,
              "end": 380.375,
              "score": 0.768,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Shalamey",
              "start": 380.415,
              "end": 380.916,
              "score": 0.747,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "looks",
              "start": 380.956,
              "end": 381.136,
              "score": 0.977,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "suitably",
              "start": 381.196,
              "end": 381.656,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fresh-faced",
              "start": 381.736,
              "end": 382.397,
              "score": 0.888,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 382.437,
              "end": 382.517,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "innocent",
              "start": 382.577,
              "end": 382.957,
              "score": 0.898,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "as",
              "start": 383.017,
              "end": 383.098,
              "score": 0.792,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Paul.",
              "start": 383.198,
              "end": 383.558,
              "score": 0.67,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 50,
      "seek": 356.519,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 383.758,
      "end": 389.563,
      "text": "The only question is whether he can pull off the transformation from pampered rich kid to kick ass freedom fighter.",
      "words": [
          {
              "word": "The",
              "start": 383.758,
              "end": 383.838,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "only",
              "start": 383.878,
              "end": 384.038,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "question",
              "start": 384.078,
              "end": 384.519,
              "score": 0.752,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 384.639,
              "end": 384.719,
              "score": 0.916,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "whether",
              "start": 384.759,
              "end": 384.979,
              "score": 0.922,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he",
              "start": 384.999,
              "end": 385.079,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 385.099,
              "end": 385.219,
              "score": 0.994,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pull",
              "start": 385.279,
              "end": 385.439,
              "score": 0.985,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "off",
              "start": 385.479,
              "end": 385.619,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 385.639,
              "end": 385.72,
              "score": 0.83,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "transformation",
              "start": 385.76,
              "end": 386.54,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "from",
              "start": 386.66,
              "end": 386.82,
              "score": 0.784,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pampered",
              "start": 386.9,
              "end": 387.321,
              "score": 0.813,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "rich",
              "start": 387.361,
              "end": 387.581,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kid",
              "start": 387.621,
              "end": 387.841,
              "score": 0.926,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 387.961,
              "end": 388.061,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kick",
              "start": 388.121,
              "end": 388.322,
              "score": 0.922,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ass",
              "start": 388.422,
              "end": 388.582,
              "score": 0.714,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "freedom",
              "start": 388.622,
              "end": 388.962,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fighter.",
              "start": 389.062,
              "end": 389.563,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 51,
      "seek": 356.519,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 389.583,
      "end": 392.965,
      "text": "I don't know man, he might need to hit the gym or something between movies.",
      "words": [
          {
              "word": "I",
              "start": 389.583,
              "end": 389.603,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "don't",
              "start": 389.823,
              "end": 389.963,
              "score": 0.457,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "know",
              "start": 390.083,
              "end": 390.243,
              "score": 0.648,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "man,",
              "start": 390.283,
              "end": 390.503,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he",
              "start": 390.623,
              "end": 390.723,
              "score": 0.828,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "might",
              "start": 390.743,
              "end": 390.864,
              "score": 0.981,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "need",
              "start": 390.884,
              "end": 391.064,
              "score": 0.462,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 391.084,
              "end": 391.144,
              "score": 0.657,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hit",
              "start": 391.184,
              "end": 391.304,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 391.344,
              "end": 391.404,
              "score": 0.848,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gym",
              "start": 391.424,
              "end": 391.624,
              "score": 0.753,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "or",
              "start": 391.664,
              "end": 391.744,
              "score": 0.74,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "something",
              "start": 391.784,
              "end": 392.125,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "between",
              "start": 392.185,
              "end": 392.485,
              "score": 0.937,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movies.",
              "start": 392.545,
              "end": 392.965,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 52,
      "seek": 389.583,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 393.345,
      "end": 399.19,
      "text": "Scar's guard is a great character actor and I guess they can put him in a fat suit to bulk him up for Baron Harkinon.",
      "words": [
          {
              "word": "Scar's",
              "start": 393.345,
              "end": 393.686,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guard",
              "start": 393.726,
              "end": 393.926,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 393.986,
              "end": 394.066,
              "score": 0.578,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 394.106,
              "end": 394.146,
              "score": 0.513,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "great",
              "start": 394.206,
              "end": 394.386,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "character",
              "start": 394.446,
              "end": 394.927,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "actor",
              "start": 395.007,
              "end": 395.307,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 395.587,
              "end": 395.667,
              "score": 0.869,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 395.687,
              "end": 395.727,
              "score": 0.469,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guess",
              "start": 395.767,
              "end": 395.968,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "they",
              "start": 396.048,
              "end": 396.148,
              "score": 0.733,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 396.168,
              "end": 396.288,
              "score": 0.627,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "put",
              "start": 396.328,
              "end": 396.468,
              "score": 0.76,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him",
              "start": 396.488,
              "end": 396.568,
              "score": 0.299,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 396.588,
              "end": 396.648,
              "score": 0.528,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 396.688,
              "end": 396.728,
              "score": 0.596,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fat",
              "start": 396.768,
              "end": 397.008,
              "score": 0.966,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "suit",
              "start": 397.048,
              "end": 397.289,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 397.329,
              "end": 397.429,
              "score": 0.843,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bulk",
              "start": 397.469,
              "end": 397.709,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him",
              "start": 397.749,
              "end": 397.849,
              "score": 0.989,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "up",
              "start": 397.929,
              "end": 398.009,
              "score": 0.744,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 398.069,
              "end": 398.209,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Baron",
              "start": 398.249,
              "end": 398.59,
              "score": 0.783,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Harkinon.",
              "start": 398.63,
              "end": 399.19,
              "score": 0.739,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 53,
      "seek": 389.583,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 399.49,
      "end": 401.712,
      "text": "Likewise, there's few movies that aren't improved",
      "words": [
          {
              "word": "Likewise,",
              "start": 399.49,
              "end": 400.011,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "there's",
              "start": 400.131,
              "end": 400.331,
              "score": 0.856,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "few",
              "start": 400.391,
              "end": 400.571,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movies",
              "start": 400.611,
              "end": 400.931,
              "score": 0.926,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 400.971,
              "end": 401.092,
              "score": 0.807,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "aren't",
              "start": 401.152,
              "end": 401.292,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "improved",
              "start": 401.352,
              "end": 401.712,
              "score": 0.791,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 54,
      "seek": 389.583,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 401.772,
      "end": 405.836,
      "text": " by the inclusion of Josh Brolin, and I don't expect Dune to buck that trend.",
      "words": [
          {
              "word": "by",
              "start": 401.772,
              "end": 401.892,
              "score": 0.902,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 401.932,
              "end": 401.992,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "inclusion",
              "start": 402.032,
              "end": 402.473,
              "score": 0.912,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 402.513,
              "end": 402.573,
              "score": 0.759,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Josh",
              "start": 402.613,
              "end": 402.893,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Brolin,",
              "start": 402.933,
              "end": 403.394,
              "score": 0.815,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 403.574,
              "end": 403.674,
              "score": 0.788,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 403.694,
              "end": 403.714,
              "score": 0.983,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "don't",
              "start": 403.754,
              "end": 403.934,
              "score": 0.738,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "expect",
              "start": 403.974,
              "end": 404.355,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Dune",
              "start": 404.395,
              "end": 404.695,
              "score": 0.739,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 404.715,
              "end": 404.815,
              "score": 0.778,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "buck",
              "start": 404.855,
              "end": 405.095,
              "score": 0.946,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 405.135,
              "end": 405.336,
              "score": 0.972,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "trend.",
              "start": 405.416,
              "end": 405.836,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 55,
      "seek": 389.583,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 406.076,
      "end": 413.144,
      "text": "His gruff and stony face does gurney howlick, which is exactly what I expected, and shit man, the movie even cracks a joker too.",
      "words": [
          {
              "word": "His",
              "start": 406.076,
              "end": 406.257,
              "score": 0.407,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gruff",
              "start": 406.377,
              "end": 406.737,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 406.777,
              "end": 406.877,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stony",
              "start": 406.977,
              "end": 407.338,
              "score": 0.991,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "face",
              "start": 407.438,
              "end": 407.738,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "does",
              "start": 407.758,
              "end": 407.878,
              "score": 0.264,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gurney",
              "start": 407.938,
              "end": 408.279,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "howlick,",
              "start": 408.319,
              "end": 408.719,
              "score": 0.657,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "which",
              "start": 408.859,
              "end": 408.999,
              "score": 0.952,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 409.059,
              "end": 409.14,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "exactly",
              "start": 409.18,
              "end": 409.6,
              "score": 0.864,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "what",
              "start": 409.66,
              "end": 409.78,
              "score": 0.885,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 409.82,
              "end": 409.9,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "expected,",
              "start": 409.98,
              "end": 410.661,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 410.941,
              "end": 411.021,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "shit",
              "start": 411.082,
              "end": 411.322,
              "score": 0.815,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "man,",
              "start": 411.342,
              "end": 411.542,
              "score": 0.814,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 411.582,
              "end": 411.642,
              "score": 0.901,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 411.682,
              "end": 411.942,
              "score": 0.72,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "even",
              "start": 411.982,
              "end": 412.143,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cracks",
              "start": 412.183,
              "end": 412.463,
              "score": 0.84,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 412.503,
              "end": 412.543,
              "score": 0.505,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "joker",
              "start": 412.563,
              "end": 412.943,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "too.",
              "start": 413.003,
              "end": 413.144,
              "score": 0.933,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 56,
      "seek": 389.583,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 416.762,
      "end": 423.629,
      "text": " There's other cast and choices that are a bit more questionable though, like Jason Momoa who feels pretty out of step with the tone of the film.",
      "words": [
          {
              "word": "There's",
              "start": 416.762,
              "end": 416.922,
              "score": 0.656,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "other",
              "start": 416.962,
              "end": 417.142,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cast",
              "start": 417.183,
              "end": 417.443,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 417.463,
              "end": 417.563,
              "score": 0.533,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "choices",
              "start": 417.583,
              "end": 418.043,
              "score": 0.841,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 418.083,
              "end": 418.224,
              "score": 0.775,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "are",
              "start": 418.264,
              "end": 418.364,
              "score": 0.781,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 418.404,
              "end": 418.424,
              "score": 0.986,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "bit",
              "start": 418.464,
              "end": 418.644,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "more",
              "start": 418.684,
              "end": 418.804,
              "score": 0.777,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "questionable",
              "start": 418.864,
              "end": 419.425,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "though,",
              "start": 419.465,
              "end": 419.685,
              "score": 0.868,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 419.945,
              "end": 420.105,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Jason",
              "start": 420.185,
              "end": 420.606,
              "score": 0.685,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Momoa",
              "start": 420.646,
              "end": 421.126,
              "score": 0.863,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 421.266,
              "end": 421.406,
              "score": 0.814,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "feels",
              "start": 421.427,
              "end": 421.627,
              "score": 0.819,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 421.707,
              "end": 421.967,
              "score": 0.946,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 422.027,
              "end": 422.127,
              "score": 0.925,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 422.167,
              "end": 422.247,
              "score": 0.828,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "step",
              "start": 422.287,
              "end": 422.568,
              "score": 0.908,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 422.588,
              "end": 422.708,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 422.728,
              "end": 422.808,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "tone",
              "start": 422.848,
              "end": 423.048,
              "score": 0.802,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 423.088,
              "end": 423.148,
              "score": 0.744,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 423.168,
              "end": 423.248,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "film.",
              "start": 423.328,
              "end": 423.629,
              "score": 0.899,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 57,
      "seek": 416.762,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 423.649,
      "end": 432.417,
      "text": "I mean don't get me wrong, he seems like a cool laid-back guy who pretty much forged a career out of playing cool laid-back guys that are just him by a different name.",
      "words": [
          {
              "word": "I",
              "start": 423.649,
              "end": 423.669,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mean",
              "start": 423.969,
              "end": 424.109,
              "score": 0.927,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "don't",
              "start": 424.129,
              "end": 424.309,
              "score": 0.819,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 424.329,
              "end": 424.449,
              "score": 0.704,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "me",
              "start": 424.469,
              "end": 424.569,
              "score": 0.85,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wrong,",
              "start": 424.609,
              "end": 424.89,
              "score": 0.777,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he",
              "start": 424.99,
              "end": 425.09,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "seems",
              "start": 425.13,
              "end": 425.37,
              "score": 0.861,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 425.41,
              "end": 425.53,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 425.57,
              "end": 425.59,
              "score": 0.982,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cool",
              "start": 425.69,
              "end": 425.951,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "laid-back",
              "start": 425.991,
              "end": 426.451,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guy",
              "start": 426.531,
              "end": 426.852,
              "score": 0.856,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 427.052,
              "end": 427.192,
              "score": 0.961,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 427.212,
              "end": 427.432,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 427.472,
              "end": 427.652,
              "score": 0.834,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "forged",
              "start": 427.732,
              "end": 428.013,
              "score": 0.737,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 428.073,
              "end": 428.113,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "career",
              "start": 428.173,
              "end": 428.533,
              "score": 0.81,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 428.633,
              "end": 428.733,
              "score": 0.897,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 428.773,
              "end": 428.853,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "playing",
              "start": 428.893,
              "end": 429.154,
              "score": 0.79,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "cool",
              "start": 429.274,
              "end": 429.614,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "laid-back",
              "start": 429.754,
              "end": 430.255,
              "score": 0.799,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guys",
              "start": 430.315,
              "end": 430.675,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 430.795,
              "end": 430.895,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "are",
              "start": 430.935,
              "end": 431.015,
              "score": 0.779,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "just",
              "start": 431.056,
              "end": 431.216,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him",
              "start": 431.296,
              "end": 431.516,
              "score": 0.906,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "by",
              "start": 431.576,
              "end": 431.736,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 431.756,
              "end": 431.796,
              "score": 0.429,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "different",
              "start": 431.836,
              "end": 432.137,
              "score": 0.883,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "name.",
              "start": 432.177,
              "end": 432.417,
              "score": 0.925,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 58,
      "seek": 416.762,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 432.737,
      "end": 438.403,
      "text": " But the problem's creeping when he has to place someone who isn't Jason Momoa, and I think that could be an issue here.",
      "words": [
          {
              "word": "But",
              "start": 432.737,
              "end": 432.837,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 432.877,
              "end": 432.957,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "problem's",
              "start": 432.997,
              "end": 433.398,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "creeping",
              "start": 433.438,
              "end": 433.878,
              "score": 0.703,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "when",
              "start": 433.938,
              "end": 434.038,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "he",
              "start": 434.078,
              "end": 434.138,
              "score": 0.762,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "has",
              "start": 434.179,
              "end": 434.299,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 434.339,
              "end": 434.399,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "place",
              "start": 434.459,
              "end": 434.659,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "someone",
              "start": 434.699,
              "end": 435.019,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 435.079,
              "end": 435.22,
              "score": 0.907,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "isn't",
              "start": 435.36,
              "end": 435.6,
              "score": 0.869,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Jason",
              "start": 435.66,
              "end": 436.06,
              "score": 0.926,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Momoa,",
              "start": 436.08,
              "end": 436.561,
              "score": 0.695,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 436.741,
              "end": 436.821,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 436.861,
              "end": 436.901,
              "score": 0.485,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 436.941,
              "end": 437.081,
              "score": 0.953,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 437.121,
              "end": 437.262,
              "score": 0.939,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 437.302,
              "end": 437.462,
              "score": 0.346,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 437.482,
              "end": 437.582,
              "score": 0.771,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "an",
              "start": 437.622,
              "end": 437.702,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "issue",
              "start": 437.742,
              "end": 438.082,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "here.",
              "start": 438.142,
              "end": 438.403,
              "score": 0.791,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 59,
      "seek": 416.762,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 438.783,
      "end": 442.186,
      "text": "Zendaya's been on my shit list ever since the Spider-Man movies.",
      "words": [
          {
              "word": "Zendaya's",
              "start": 438.783,
              "end": 439.404,
              "score": 0.674,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "been",
              "start": 439.424,
              "end": 439.584,
              "score": 0.767,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 439.624,
              "end": 439.684,
              "score": 0.761,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "my",
              "start": 439.724,
              "end": 439.844,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "shit",
              "start": 439.904,
              "end": 440.124,
              "score": 0.984,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "list",
              "start": 440.164,
              "end": 440.385,
              "score": 0.812,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ever",
              "start": 440.445,
              "end": 440.625,
              "score": 0.881,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "since",
              "start": 440.665,
              "end": 440.865,
              "score": 0.977,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 440.925,
              "end": 441.025,
              "score": 0.843,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Spider-Man",
              "start": 441.065,
              "end": 441.726,
              "score": 0.856,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movies.",
              "start": 441.766,
              "end": 442.186,
              "score": 0.784,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 60,
      "seek": 416.762,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 442.447,
      "end": 449.874,
      "text": "Watching her absolutely murder MJ was like giving yourself a sandpaper suppository, and it kind of soured me on the actress after that.",
      "words": [
          {
              "word": "Watching",
              "start": 442.447,
              "end": 442.807,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "her",
              "start": 442.847,
              "end": 442.987,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "absolutely",
              "start": 443.187,
              "end": 443.788,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "murder",
              "start": 443.888,
              "end": 444.268,
              "score": 0.809,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "MJ",
              "start": 444.428,
              "end": 444.749,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "was",
              "start": 444.849,
              "end": 444.989,
              "score": 0.581,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 445.009,
              "end": 445.169,
              "score": 0.767,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "giving",
              "start": 445.209,
              "end": 445.449,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "yourself",
              "start": 445.49,
              "end": 445.85,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 445.91,
              "end": 445.95,
              "score": 0.975,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sandpaper",
              "start": 446.01,
              "end": 446.611,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "suppository,",
              "start": 446.631,
              "end": 447.411,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 447.612,
              "end": 447.712,
              "score": 0.712,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 447.732,
              "end": 447.772,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kind",
              "start": 447.812,
              "end": 447.952,
              "score": 0.342,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 448.012,
              "end": 448.092,
              "score": 0.298,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "soured",
              "start": 448.152,
              "end": 448.492,
              "score": 0.723,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "me",
              "start": 448.512,
              "end": 448.613,
              "score": 0.974,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 448.673,
              "end": 448.733,
              "score": 0.982,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 448.773,
              "end": 448.853,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "actress",
              "start": 448.933,
              "end": 449.313,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "after",
              "start": 449.393,
              "end": 449.634,
              "score": 0.923,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that.",
              "start": 449.694,
              "end": 449.874,
              "score": 0.975,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 61,
      "seek": 416.762,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 450.194,
      "end": 457.824,
      "text": " The fact that she's such a vocal activist for, well, pretty much everything doesn't make it any easier to separate the art from the artist.",
      "words": [
          {
              "word": "The",
              "start": 450.194,
              "end": 450.294,
              "score": 0.983,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fact",
              "start": 450.334,
              "end": 450.515,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 450.555,
              "end": 450.675,
              "score": 0.971,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "she's",
              "start": 450.695,
              "end": 450.875,
              "score": 0.783,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "such",
              "start": 450.915,
              "end": 451.115,
              "score": 0.863,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 451.155,
              "end": 451.175,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "vocal",
              "start": 451.295,
              "end": 451.636,
              "score": 0.938,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "activist",
              "start": 451.756,
              "end": 452.197,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for,",
              "start": 452.297,
              "end": 452.517,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "well,",
              "start": 452.857,
              "end": 453.098,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "pretty",
              "start": 453.378,
              "end": 453.638,
              "score": 0.898,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 453.658,
              "end": 453.839,
              "score": 0.756,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "everything",
              "start": 454.059,
              "end": 454.6,
              "score": 0.76,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "doesn't",
              "start": 454.76,
              "end": 455.02,
              "score": 0.719,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "make",
              "start": 455.06,
              "end": 455.22,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 455.26,
              "end": 455.3,
              "score": 0.989,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "any",
              "start": 455.381,
              "end": 455.521,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "easier",
              "start": 455.601,
              "end": 455.901,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 455.961,
              "end": 456.041,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "separate",
              "start": 456.101,
              "end": 456.522,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 456.562,
              "end": 456.662,
              "score": 0.677,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "art",
              "start": 456.742,
              "end": 456.882,
              "score": 0.883,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "from",
              "start": 456.923,
              "end": 457.063,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 457.103,
              "end": 457.203,
              "score": 0.688,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "artist.",
              "start": 457.303,
              "end": 457.824,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 62,
      "seek": 450.194,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 458.084,
      "end": 467.335,
      "text": "I mean, I guess I'll try to keep an open mind on this one, but our character is going to be a key player in this film, and I've got a lingering suspicion that her version of Chani is going to be just another",
      "words": [
          {
              "word": "I",
              "start": 458.084,
              "end": 458.124,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mean,",
              "start": 458.164,
              "end": 458.324,
              "score": 0.676,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 458.424,
              "end": 458.464,
              "score": 1.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "guess",
              "start": 458.504,
              "end": 458.645,
              "score": 0.934,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I'll",
              "start": 458.685,
              "end": 458.845,
              "score": 0.852,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "try",
              "start": 458.865,
              "end": 459.025,
              "score": 0.76,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 459.065,
              "end": 459.125,
              "score": 0.748,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "keep",
              "start": 459.165,
              "end": 459.366,
              "score": 0.863,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "an",
              "start": 459.406,
              "end": 459.466,
              "score": 0.49,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "open",
              "start": 459.526,
              "end": 459.746,
              "score": 0.916,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mind",
              "start": 459.786,
              "end": 460.006,
              "score": 0.783,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 460.086,
              "end": 460.167,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 460.207,
              "end": 460.367,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one,",
              "start": 460.507,
              "end": 460.627,
              "score": 0.519,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 460.727,
              "end": 460.827,
              "score": 0.948,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "our",
              "start": 460.887,
              "end": 460.948,
              "score": 0.062,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "character",
              "start": 461.008,
              "end": 461.408,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 461.448,
              "end": 461.508,
              "score": 0.527,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "going",
              "start": 461.548,
              "end": 461.688,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 461.708,
              "end": 461.749,
              "score": 0.99,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 461.769,
              "end": 461.869,
              "score": 0.58,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 461.909,
              "end": 461.929,
              "score": 0.997,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "key",
              "start": 461.989,
              "end": 462.209,
              "score": 0.97,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "player",
              "start": 462.269,
              "end": 462.59,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 462.65,
              "end": 462.71,
              "score": 0.802,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 462.75,
              "end": 462.91,
              "score": 0.851,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "film,",
              "start": 463.01,
              "end": 463.27,
              "score": 0.977,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 463.431,
              "end": 463.491,
              "score": 0.994,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 463.531,
              "end": 463.631,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 463.651,
              "end": 463.791,
              "score": 0.679,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 463.811,
              "end": 463.831,
              "score": 0.934,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "lingering",
              "start": 463.891,
              "end": 464.272,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "suspicion",
              "start": 464.332,
              "end": 464.872,
              "score": 0.798,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 464.973,
              "end": 465.093,
              "score": 0.907,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "her",
              "start": 465.133,
              "end": 465.253,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "version",
              "start": 465.333,
              "end": 465.633,
              "score": 0.949,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 465.673,
              "end": 465.713,
              "score": 1.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Chani",
              "start": 465.794,
              "end": 466.194,
              "score": 0.783,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 466.274,
              "end": 466.354,
              "score": 0.696,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "going",
              "start": 466.394,
              "end": 466.514,
              "score": 0.898,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 466.534,
              "end": 466.575,
              "score": 0.985,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 466.615,
              "end": 466.715,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "just",
              "start": 466.755,
              "end": 466.995,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "another",
              "start": 467.055,
              "end": 467.335,
              "score": 0.929,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 63,
      "seek": 450.194,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 467.796,
      "end": 476.499,
      "text": " Strong female character that dominates and outperforms Paul in every situation, relegating him to a background character in his own story.",
      "words": [
          {
              "word": "Strong",
              "start": 467.796,
              "end": 468.456,
              "score": 0.841,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "female",
              "start": 468.496,
              "end": 468.976,
              "score": 0.526,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "character",
              "start": 469.057,
              "end": 469.957,
              "score": 0.635,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 470.237,
              "end": 470.377,
              "score": 0.674,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "dominates",
              "start": 470.457,
              "end": 470.977,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 471.117,
              "end": 471.197,
              "score": 0.728,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "outperforms",
              "start": 471.277,
              "end": 471.878,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Paul",
              "start": 471.958,
              "end": 472.238,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 472.278,
              "end": 472.358,
              "score": 0.428,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "every",
              "start": 472.418,
              "end": 472.638,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "situation,",
              "start": 472.678,
              "end": 473.398,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "relegating",
              "start": 473.578,
              "end": 474.059,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "him",
              "start": 474.099,
              "end": 474.179,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 474.239,
              "end": 474.359,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 474.419,
              "end": 474.439,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "background",
              "start": 474.479,
              "end": 474.939,
              "score": 0.731,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "character",
              "start": 474.999,
              "end": 475.419,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 475.459,
              "end": 475.519,
              "score": 0.966,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 475.559,
              "end": 475.659,
              "score": 0.709,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "own",
              "start": 475.699,
              "end": 475.839,
              "score": 0.635,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "story.",
              "start": 475.959,
              "end": 476.499,
              "score": 0.754,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 64,
      "seek": 450.194,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 476.84,
      "end": 488.604,
      "text": "I mean, when you think about it, the books already provide fertile ground for this kind of thing, especially the old female Benny Gesserit organization who used seduction and manipulation to direct events behind the scenes.",
      "words": [
          {
              "word": "I",
              "start": 476.84,
              "end": 476.88,
              "score": 0.998,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mean,",
              "start": 476.92,
              "end": 477.08,
              "score": 0.763,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "when",
              "start": 477.14,
              "end": 477.24,
              "score": 1.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "you",
              "start": 477.28,
              "end": 477.38,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "think",
              "start": 477.4,
              "end": 477.58,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "about",
              "start": 477.64,
              "end": 477.94,
              "score": 0.856,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it,",
              "start": 478.02,
              "end": 478.08,
              "score": 0.75,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 478.2,
              "end": 478.3,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "books",
              "start": 478.32,
              "end": 478.58,
              "score": 0.826,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "already",
              "start": 478.64,
              "end": 478.98,
              "score": 0.859,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "provide",
              "start": 479.061,
              "end": 479.441,
              "score": 0.817,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fertile",
              "start": 479.501,
              "end": 479.961,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "ground",
              "start": 480.001,
              "end": 480.281,
              "score": 0.841,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 480.321,
              "end": 480.421,
              "score": 0.998,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 480.461,
              "end": 480.601,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kind",
              "start": 480.661,
              "end": 480.841,
              "score": 0.724,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 480.881,
              "end": 480.921,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "thing,",
              "start": 480.981,
              "end": 481.201,
              "score": 0.87,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "especially",
              "start": 481.461,
              "end": 482.042,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 482.062,
              "end": 482.122,
              "score": 0.0,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "old",
              "start": 482.362,
              "end": 482.502,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "female",
              "start": 482.622,
              "end": 482.982,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Benny",
              "start": 483.062,
              "end": 483.362,
              "score": 0.815,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Gesserit",
              "start": 483.402,
              "end": 483.882,
              "score": 0.695,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "organization",
              "start": 483.942,
              "end": 484.703,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "who",
              "start": 484.863,
              "end": 484.983,
              "score": 0.913,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "used",
              "start": 485.063,
              "end": 485.203,
              "score": 0.67,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "seduction",
              "start": 485.263,
              "end": 485.863,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 485.903,
              "end": 485.983,
              "score": 0.776,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "manipulation",
              "start": 486.023,
              "end": 486.744,
              "score": 0.886,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 486.804,
              "end": 486.904,
              "score": 0.838,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "direct",
              "start": 486.944,
              "end": 487.244,
              "score": 0.901,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "events",
              "start": 487.324,
              "end": 487.624,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "behind",
              "start": 487.704,
              "end": 488.004,
              "score": 0.846,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 488.044,
              "end": 488.144,
              "score": 0.73,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "scenes.",
              "start": 488.204,
              "end": 488.604,
              "score": 0.845,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 65,
      "seek": 476.84,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 489.005,
      "end": 494.927,
      "text": "Normally stuff like that would just make for an interest in part of the narrative, but given how things are in Hollywood these days,",
      "words": [
          {
              "word": "Normally",
              "start": 489.005,
              "end": 489.405,
              "score": 0.915,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stuff",
              "start": 489.445,
              "end": 489.685,
              "score": 0.951,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 489.705,
              "end": 489.865,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 489.905,
              "end": 490.105,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "would",
              "start": 490.145,
              "end": 490.305,
              "score": 0.675,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "just",
              "start": 490.325,
              "end": 490.485,
              "score": 0.761,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "make",
              "start": 490.525,
              "end": 490.705,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 490.745,
              "end": 490.885,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "an",
              "start": 490.925,
              "end": 490.985,
              "score": 0.758,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "interest",
              "start": 491.025,
              "end": 491.385,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 491.425,
              "end": 491.526,
              "score": 0.769,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "part",
              "start": 491.566,
              "end": 491.766,
              "score": 0.914,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 491.786,
              "end": 491.846,
              "score": 0.778,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 491.886,
              "end": 491.966,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "narrative,",
              "start": 492.026,
              "end": 492.586,
              "score": 0.803,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "but",
              "start": 492.726,
              "end": 492.846,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "given",
              "start": 492.886,
              "end": 493.106,
              "score": 0.882,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "how",
              "start": 493.146,
              "end": 493.266,
              "score": 0.922,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "things",
              "start": 493.326,
              "end": 493.566,
              "score": 0.793,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "are",
              "start": 493.666,
              "end": 493.786,
              "score": 0.629,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 493.846,
              "end": 493.906,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Hollywood",
              "start": 493.946,
              "end": 494.367,
              "score": 0.651,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "these",
              "start": 494.407,
              "end": 494.627,
              "score": 0.815,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "days,",
              "start": 494.687,
              "end": 494.927,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 66,
      "seek": 476.84,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 495.347,
      "end": 504.355,
      "text": " Well, I don't know man, I can see how easily this could all go horribly wrong if they try to impose modern gender politics on a story more than half a century old.",
      "words": [
          {
              "word": "Well,",
              "start": 495.347,
              "end": 495.627,
              "score": 0.952,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 495.868,
              "end": 495.928,
              "score": 0.692,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "don't",
              "start": 495.948,
              "end": 496.088,
              "score": 0.8,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "know",
              "start": 496.128,
              "end": 496.288,
              "score": 0.736,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "man,",
              "start": 496.328,
              "end": 496.588,
              "score": 0.904,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I",
              "start": 496.848,
              "end": 496.909,
              "score": 0.784,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "can",
              "start": 496.929,
              "end": 497.069,
              "score": 0.982,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "see",
              "start": 497.109,
              "end": 497.249,
              "score": 0.702,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "how",
              "start": 497.269,
              "end": 497.389,
              "score": 0.844,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "easily",
              "start": 497.469,
              "end": 497.769,
              "score": 0.869,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 497.809,
              "end": 497.95,
              "score": 0.854,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 498.01,
              "end": 498.15,
              "score": 0.89,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 498.19,
              "end": 498.31,
              "score": 0.972,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "go",
              "start": 498.35,
              "end": 498.47,
              "score": 0.98,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "horribly",
              "start": 498.53,
              "end": 498.93,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wrong",
              "start": 498.97,
              "end": 499.251,
              "score": 0.753,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "if",
              "start": 499.371,
              "end": 499.451,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "they",
              "start": 499.471,
              "end": 499.611,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "try",
              "start": 499.651,
              "end": 499.851,
              "score": 0.759,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 499.891,
              "end": 499.971,
              "score": 0.996,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "impose",
              "start": 500.051,
              "end": 500.412,
              "score": 0.992,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "modern",
              "start": 500.512,
              "end": 500.872,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gender",
              "start": 500.892,
              "end": 501.273,
              "score": 0.827,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "politics",
              "start": 501.313,
              "end": 501.853,
              "score": 0.872,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 502.033,
              "end": 502.113,
              "score": 0.893,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 502.153,
              "end": 502.193,
              "score": 0.494,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "story",
              "start": 502.254,
              "end": 502.634,
              "score": 0.873,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "more",
              "start": 502.694,
              "end": 502.834,
              "score": 0.935,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "than",
              "start": 502.874,
              "end": 503.014,
              "score": 0.849,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "half",
              "start": 503.074,
              "end": 503.274,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 503.315,
              "end": 503.335,
              "score": 0.979,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "century",
              "start": 503.415,
              "end": 503.895,
              "score": 0.877,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "old.",
              "start": 504.075,
              "end": 504.355,
              "score": 0.804,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 67,
      "seek": 476.84,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 504.676,
      "end": 510.201,
      "text": "I really hope I'm wrong on this one, because it feels like this movie could be the start of something special if they get it right.",
      "words": [
          {
              "word": "I",
              "start": 504.676,
              "end": 504.756,
              "score": 0.735,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "really",
              "start": 504.796,
              "end": 505.016,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hope",
              "start": 505.056,
              "end": 505.196,
              "score": 0.879,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I'm",
              "start": 505.256,
              "end": 505.356,
              "score": 0.77,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wrong",
              "start": 505.396,
              "end": 505.577,
              "score": 0.88,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "on",
              "start": 505.617,
              "end": 505.717,
              "score": 0.574,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 505.737,
              "end": 505.897,
              "score": 0.806,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "one,",
              "start": 506.037,
              "end": 506.137,
              "score": 0.831,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "because",
              "start": 506.297,
              "end": 506.517,
              "score": 0.889,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 506.558,
              "end": 506.638,
              "score": 0.499,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "feels",
              "start": 506.678,
              "end": 506.938,
              "score": 0.753,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 506.978,
              "end": 507.138,
              "score": 0.754,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 507.158,
              "end": 507.278,
              "score": 0.876,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 507.358,
              "end": 507.639,
              "score": 0.722,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "could",
              "start": 507.679,
              "end": 507.819,
              "score": 0.803,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 507.839,
              "end": 507.939,
              "score": 0.857,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 507.959,
              "end": 508.039,
              "score": 0.821,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "start",
              "start": 508.079,
              "end": 508.319,
              "score": 0.933,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 508.359,
              "end": 508.419,
              "score": 0.706,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "something",
              "start": 508.459,
              "end": 508.76,
              "score": 0.932,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "special",
              "start": 508.82,
              "end": 509.28,
              "score": 0.897,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "if",
              "start": 509.34,
              "end": 509.4,
              "score": 0.998,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "they",
              "start": 509.44,
              "end": 509.56,
              "score": 0.886,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "get",
              "start": 509.6,
              "end": 509.72,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 509.76,
              "end": 509.801,
              "score": 0.986,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "right.",
              "start": 509.901,
              "end": 510.201,
              "score": 0.702,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 68,
      "seek": 504.676,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 510.461,
      "end": 513.484,
      "text": "It's got the right director, the right looking feel, and all it",
      "words": [
          {
              "word": "It's",
              "start": 510.461,
              "end": 510.601,
              "score": 0.833,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 510.621,
              "end": 510.761,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 510.801,
              "end": 510.882,
              "score": 0.824,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "right",
              "start": 510.922,
              "end": 511.102,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "director,",
              "start": 511.142,
              "end": 511.682,
              "score": 0.801,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 511.943,
              "end": 512.023,
              "score": 0.981,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "right",
              "start": 512.063,
              "end": 512.223,
              "score": 0.818,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "looking",
              "start": 512.263,
              "end": 512.583,
              "score": 0.841,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "feel,",
              "start": 512.683,
              "end": 512.963,
              "score": 0.93,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 513.204,
              "end": 513.264,
              "score": 0.001,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 513.324,
              "end": 513.424,
              "score": 0.158,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 513.444,
              "end": 513.484,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 69,
      "seek": 504.676,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 513.544,
      "end": 516.647,
      "text": " really needs to do is stay faithful to the source material.",
      "words": [
          {
              "word": "really",
              "start": 513.544,
              "end": 513.784,
              "score": 0.944,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "needs",
              "start": 513.824,
              "end": 514.044,
              "score": 0.883,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 514.125,
              "end": 514.205,
              "score": 0.847,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "do",
              "start": 514.245,
              "end": 514.425,
              "score": 0.95,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 514.445,
              "end": 514.485,
              "score": 0.026,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "stay",
              "start": 514.725,
              "end": 514.985,
              "score": 0.822,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "faithful",
              "start": 515.025,
              "end": 515.386,
              "score": 0.976,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 515.426,
              "end": 515.546,
              "score": 0.66,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 515.566,
              "end": 515.626,
              "score": 0.965,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "source",
              "start": 515.686,
              "end": 515.986,
              "score": 0.951,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "material.",
              "start": 516.026,
              "end": 516.647,
              "score": 0.908,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 70,
      "seek": 504.676,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 516.947,
      "end": 520.21,
      "text": "Will it make the kind of money needed to kickstart an epic franchise?",
      "words": [
          {
              "word": "Will",
              "start": 516.947,
              "end": 517.107,
              "score": 0.81,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it",
              "start": 517.147,
              "end": 517.207,
              "score": 0.751,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "make",
              "start": 517.247,
              "end": 517.407,
              "score": 0.866,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 517.447,
              "end": 517.528,
              "score": 0.832,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kind",
              "start": 517.548,
              "end": 517.728,
              "score": 0.82,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 517.768,
              "end": 517.808,
              "score": 0.993,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "money",
              "start": 517.868,
              "end": 518.068,
              "score": 0.729,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "needed",
              "start": 518.128,
              "end": 518.368,
              "score": 0.984,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 518.388,
              "end": 518.468,
              "score": 0.764,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "kickstart",
              "start": 518.508,
              "end": 518.989,
              "score": 0.814,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "an",
              "start": 519.029,
              "end": 519.109,
              "score": 0.842,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "epic",
              "start": 519.189,
              "end": 519.449,
              "score": 0.952,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "franchise?",
              "start": 519.509,
              "end": 520.21,
              "score": 0.918,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 71,
      "seek": 504.676,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 520.57,
      "end": 521.631,
      "text": "I don't know to be honest.",
      "words": [
          {
              "word": "I",
              "start": 520.57,
              "end": 520.61,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "don't",
              "start": 520.63,
              "end": 520.79,
              "score": 0.81,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "know",
              "start": 520.81,
              "end": 520.951,
              "score": 0.755,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 521.031,
              "end": 521.131,
              "score": 0.926,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 521.171,
              "end": 521.271,
              "score": 0.641,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "honest.",
              "start": 521.291,
              "end": 521.631,
              "score": 0.703,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 72,
      "seek": 504.676,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 521.951,
      "end": 531.16,
      "text": "As popular as June is with sci-fi fans, it's not all that accessible to general audiences, and the October release date doesn't exactly scream box of his gold either.",
      "words": [
          {
              "word": "As",
              "start": 521.951,
              "end": 522.072,
              "score": 0.656,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "popular",
              "start": 522.112,
              "end": 522.592,
              "score": 0.882,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "as",
              "start": 522.652,
              "end": 522.712,
              "score": 0.776,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "June",
              "start": 522.772,
              "end": 522.992,
              "score": 0.865,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "is",
              "start": 523.012,
              "end": 523.173,
              "score": 0.73,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "with",
              "start": 523.213,
              "end": 523.353,
              "score": 0.964,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "sci-fi",
              "start": 523.413,
              "end": 523.893,
              "score": 0.699,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "fans,",
              "start": 523.953,
              "end": 524.294,
              "score": 0.722,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "it's",
              "start": 524.494,
              "end": 524.614,
              "score": 0.862,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "not",
              "start": 524.654,
              "end": 524.814,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 524.854,
              "end": 524.974,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 524.994,
              "end": 525.134,
              "score": 0.716,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "accessible",
              "start": 525.174,
              "end": 525.795,
              "score": 0.945,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 525.835,
              "end": 525.935,
              "score": 0.978,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "general",
              "start": 525.995,
              "end": 526.335,
              "score": 0.795,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "audiences,",
              "start": 526.415,
              "end": 526.996,
              "score": 0.962,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "and",
              "start": 527.216,
              "end": 527.296,
              "score": 0.839,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "the",
              "start": 527.316,
              "end": 527.396,
              "score": 0.961,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "October",
              "start": 527.456,
              "end": 527.877,
              "score": 0.793,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "release",
              "start": 527.917,
              "end": 528.237,
              "score": 0.886,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "date",
              "start": 528.277,
              "end": 528.517,
              "score": 0.318,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "doesn't",
              "start": 528.537,
              "end": 528.818,
              "score": 0.753,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "exactly",
              "start": 528.858,
              "end": 529.298,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "scream",
              "start": 529.338,
              "end": 529.698,
              "score": 0.686,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "box",
              "start": 529.778,
              "end": 530.079,
              "score": 0.942,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "of",
              "start": 530.159,
              "end": 530.239,
              "score": 0.96,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "his",
              "start": 530.279,
              "end": 530.399,
              "score": 0.816,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gold",
              "start": 530.479,
              "end": 530.819,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "either.",
              "start": 530.899,
              "end": 531.16,
              "score": 0.794,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 73,
      "seek": 504.676,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 531.48,
      "end": 540.047,
      "text": "My gap tells me that much like Blade Runner 2049, it'll turn out to be a decent movie that doesn't have enough broad appeal to break out into mainstream success.",
      "words": [
          {
              "word": "My",
              "start": 531.48,
              "end": 531.58,
              "score": 0.756,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "gap",
              "start": 531.62,
              "end": 531.82,
              "score": 0.629,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "tells",
              "start": 531.86,
              "end": 532.12,
              "score": 0.807,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "me",
              "start": 532.18,
              "end": 532.301,
              "score": 0.97,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 532.341,
              "end": 532.461,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "much",
              "start": 532.521,
              "end": 532.701,
              "score": 0.896,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "like",
              "start": 532.761,
              "end": 532.921,
              "score": 0.766,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Blade",
              "start": 532.961,
              "end": 533.221,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "Runner",
              "start": 533.261,
              "end": 534.202,
              "score": 0.627,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "2049,"
          },
          {
              "word": "it'll",
              "start": 534.382,
              "end": 534.863,
              "score": 0.771,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "turn",
              "start": 534.903,
              "end": 535.083,
              "score": 0.785,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 535.143,
              "end": 535.243,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 535.303,
              "end": 535.383,
              "score": 0.752,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 535.423,
              "end": 535.523,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "a",
              "start": 535.563,
              "end": 535.603,
              "score": 0.529,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "decent",
              "start": 535.644,
              "end": 535.964,
              "score": 0.855,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "movie",
              "start": 536.004,
              "end": 536.364,
              "score": 0.644,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that",
              "start": 536.464,
              "end": 536.604,
              "score": 0.912,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "doesn't",
              "start": 536.644,
              "end": 536.905,
              "score": 0.86,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "have",
              "start": 536.965,
              "end": 537.105,
              "score": 0.887,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "enough",
              "start": 537.145,
              "end": 537.345,
              "score": 0.917,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "broad",
              "start": 537.385,
              "end": 537.625,
              "score": 0.911,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "appeal",
              "start": 537.685,
              "end": 538.026,
              "score": 0.91,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 538.066,
              "end": 538.146,
              "score": 0.995,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "break",
              "start": 538.186,
              "end": 538.406,
              "score": 0.968,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "out",
              "start": 538.466,
              "end": 538.546,
              "score": 0.852,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "into",
              "start": 538.586,
              "end": 538.746,
              "score": 0.94,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "mainstream",
              "start": 538.786,
              "end": 539.307,
              "score": 0.616,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "success.",
              "start": 539.347,
              "end": 540.047,
              "score": 0.799,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 74,
      "seek": 531.48,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 540.328,
      "end": 540.648,
      "text": "But hey,",
      "words": [
          {
              "word": "But",
              "start": 540.328,
              "end": 540.468,
              "score": 0.928,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "hey,",
              "start": 540.528,
              "end": 540.648,
              "score": 0.639,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 75,
      "seek": 531.48,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 540.908,
      "end": 543.515,
      "text": " I'm really happy to be proved wrong in this case.",
      "words": [
          {
              "word": "I'm",
              "start": 540.908,
              "end": 541.049,
              "score": 0.908,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "really",
              "start": 541.169,
              "end": 541.47,
              "score": 0.825,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "happy",
              "start": 541.53,
              "end": 541.811,
              "score": 0.962,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "to",
              "start": 541.851,
              "end": 541.931,
              "score": 0.578,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "be",
              "start": 541.971,
              "end": 542.071,
              "score": 0.835,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "proved",
              "start": 542.132,
              "end": 542.412,
              "score": 0.903,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "wrong",
              "start": 542.472,
              "end": 542.713,
              "score": 0.786,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "in",
              "start": 542.753,
              "end": 542.833,
              "score": 0.836,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "this",
              "start": 542.873,
              "end": 543.054,
              "score": 0.874,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "case.",
              "start": 543.134,
              "end": 543.515,
              "score": 0.872,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 76,
      "seek": 531.48,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 544.578,
      "end": 547.164,
      "text": "Anyway, that's all I've got for today.",
      "words": [
          {
              "word": "Anyway,",
              "start": 544.578,
              "end": 544.959,
              "score": 0.735,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "that's",
              "start": 545.46,
              "end": 545.72,
              "score": 0.867,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "all",
              "start": 545.801,
              "end": 545.941,
              "score": 0.871,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "I've",
              "start": 546.001,
              "end": 546.121,
              "score": 0.595,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "got",
              "start": 546.162,
              "end": 546.422,
              "score": 0.905,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "for",
              "start": 546.442,
              "end": 546.623,
              "score": 0.909,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "today.",
              "start": 546.643,
              "end": 547.164,
              "score": 0.768,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 77,
      "seek": 531.48,
      "speaker": "SPEAKER_00"
  },
  {
      "start": 548.146,
      "end": 548.968,
      "text": "Go away now.",
      "words": [
          {
              "word": "Go",
              "start": 548.146,
              "end": 548.347,
              "score": 0.808,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "away",
              "start": 548.447,
              "end": 548.708,
              "score": 0.884,
              "speaker": "SPEAKER_00"
          },
          {
              "word": "now.",
              "start": 548.788,
              "end": 548.968,
              "score": 0.999,
              "speaker": "SPEAKER_00"
          }
      ],
      "id": 78,
      "seek": 531.48,
      "speaker": "SPEAKER_00"
  }
];

const Transcript: React.FC<TranscriptProps> = ({ episodeId }) => {
  const fontSize = useBreakpointValue({ base: "md", md: "lg" });
  const [transcript, setTranscript] = useState(null);
  const [visibleWords, setVisibleWords] = useState([]);
  const { state, dispatch, audioRef } = usePlayer();
  const transcriptBoxRef = useRef(null);

  useEffect(() => {
    if (episodeId) {
      setTranscript(dummyTranscript)
      // PodcastHelper.getTranscript(episodeId)
      //   .then((res) => {
      //     if (res.status === 200) {
      //       setTranscript(res.transcript);
      //     } else {
      //       console.error("Error fetching transcripts data:", res.message);
      //     }
      //   })
      //   .catch((error) => console.error("Error fetching transcripts data:", error));
    }
  }, [episodeId]);

  useEffect(() => {
    const updateVisibleWords = () => {
      if (transcript && audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        let wordsToShow = [];
        // Iterate through each segment of the transcript
        transcript.forEach(segment => {
          // For each segment, check if the current time is past the segment's start time
          if (currentTime >= segment.start) {
            // For each word in the segment, add it if the current time is past the word's start time
            segment.words.forEach(word => {
              if (currentTime >= word.start) {
                wordsToShow.push(word);
              }
            });
          }
        });
        // Update the state to show all words up to the current time
        setVisibleWords(wordsToShow);
      }
    };

    const interval = setInterval(updateVisibleWords, 10); // Update visible words every 500ms

    return () => clearInterval(interval);
  }, [transcript, audioRef]);

  //scrollbar follows down as the text progresses
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [visibleWords]); // Depend on visibleWords to trigger the scroll

  return (
    <Box
      border="3px solid rgba(255, 255, 255, 0.05)"
      width="100%"
      height="100%"
      p={2}
      borderRadius="1.1em"
    >
      <Flex justifyContent="flex-start" alignItems="center" m={3}>
        <Icon as={LuBookCopy} boxSize={5} />
        <Text fontSize={fontSize} fontWeight="bold" ml={2}>
          Transcript
        </Text>
      </Flex>
      <Box 
        overflowY="auto" 
        mb={4} maxH="15vh" 
        p={3} 
        ref={transcriptBoxRef}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for Chrome, Safari, and newer Edge
          },
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          '-ms-overflow-style': 'none',  // Hide scrollbar for IE 10+
          pointerEvents: 'none', // Disable pointer events so that user can't scroll up
        }}
      >

        <Text className="transcript-text" fontSize={fontSize} color="white">
    {visibleWords.map((word, index) => (
      <span
        key={index}
        className="text-appear"
      >
        {word.word}{' '}
      </span>
    ))}
  </Text>
      </Box>
    </Box>
  );
};

export default Transcript;
