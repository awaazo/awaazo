import argparse
import os
import sys

now_dir = os.getcwd()
sys.path.append(now_dir)
from dotenv import load_dotenv
from scipy.io import wavfile


from configs.config import Config
from infer.modules.vc.modules import VC

####
# USAGE
#
# In your Terminal or CMD or whatever


def arg_parse() -> tuple:
    parser = argparse.ArgumentParser()
    parser.add_argument("--f0up_key", type=int, default=0)
    parser.add_argument("--input_path", type=str, help="input path")
    parser.add_argument("--index_path", type=str, help="index path")
    parser.add_argument("--f0method", type=str, default="harvest", help="harvest or pm")
    parser.add_argument("--opt_path", type=str, help="opt path")
    parser.add_argument("--model_name", type=str, help="store in assets/weight_root")
    parser.add_argument("--index_rate", type=float, default=0.66, help="index rate")
    parser.add_argument("--device", type=str, help="device")
    parser.add_argument("--is_half", type=bool, help="use half -> True")
    parser.add_argument("--filter_radius", type=int, default=3, help="filter radius")
    parser.add_argument("--resample_sr", type=int, default=0, help="resample sr")
    parser.add_argument("--rms_mix_rate", type=float, default=1, help="rms mix rate")
    parser.add_argument("--protect", type=float, default=0.33, help="protect")

    args = parser.parse_args()
    sys.argv = sys.argv[:1]

    return args


def main():
    print("Infer CLI Start...")
    print("Loading .env...")

    # Load .env
    load_dotenv()
    print("Loading .env Done...")
    
    
    args = arg_parse()
    print(f"args: {args}\n")
    

    config = Config()
    print(f"config: {config}\n")

    config.device = args.device if args.device else config.device
    config.is_half = args.is_half if args.is_half else config.is_half
    
    print(f"config device: {config.device}\n")
    print(f"config is_half: {config.is_half}\n")
    
    vc = VC(config)

    print(f"vc: {vc}\n")

    # Model Name
    sid = "drinker_v2.pth"

    print(f"protected: {args.protect}\n")

    vc.get_vc(sid,args.protect,args.protect)

    print(f"vc model_name: {args.model_name}\n")

    args.f0method = "rmvpe"
    args.input_path = "C:\\Users\\Mathieu\\Desktop\\Elon Musk High Quality Voice Sample ElevenLabs AI Voice.wav"
    args.index_path = "C:\\Users\\Mathieu\\Desktop\\RVC1006Nvidia\\logs\\drinker_v2.index"
    #args.file_index2 = "logs/drinker_v2.index"
    args.index_rate = 0.5
    args.filter_radius = 3
    args.resample_sr = 0
    args.rms_mix_rate = 0.25

    _, wav_opt = vc.vc_single(
        0,
        args.input_path,
        args.f0up_key,
        None,
        args.f0method,
        args.index_path,
        None,
        args.index_rate,
        args.filter_radius,
        args.resample_sr,
        args.rms_mix_rate,
        args.protect,
    )
    
    print(f"wav_opt: {wav_opt}\n")
    print(f"_: {_}\n")

    args.opt_path = "C:\\Users\\Mathieu\\Desktop\\test_1.wav"

    print(f"args.opt_path: {args.opt_path}\n")

    wavfile.write(args.opt_path, wav_opt[0], wav_opt[1])


if __name__ == "__main__":
    main()
