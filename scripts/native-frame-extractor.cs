using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Media.Editing;
using Windows.Storage;

internal static class NativeFrameExtractor
{
    private static async Task Run(string input, string output, double seconds, uint width, uint height)
    {
        var file = await StorageFile.GetFileFromPathAsync(Path.GetFullPath(input));
        var clip = await MediaClip.CreateFromFileAsync(file);
        var composition = new MediaComposition();
        composition.Clips.Add(clip);
        using (var thumbnail = await composition.GetThumbnailAsync(
            TimeSpan.FromSeconds(seconds), width, height, VideoFramePrecision.NearestFrame))
        using (var source = thumbnail.AsStreamForRead())
        using (var destination = File.Create(output))
        {
            await source.CopyToAsync(destination);
        }
    }

    public static int Main(string[] args)
    {
        if (args.Length != 5)
        {
            Console.Error.WriteLine("usage: native-frame-extractor <input> <output> <seconds> <width> <height>");
            return 2;
        }

        Run(args[0], args[1], double.Parse(args[2], System.Globalization.CultureInfo.InvariantCulture),
            uint.Parse(args[3]), uint.Parse(args[4])).GetAwaiter().GetResult();
        return 0;
    }
}
